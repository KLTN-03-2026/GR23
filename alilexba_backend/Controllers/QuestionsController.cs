using alilexba_backend.Data;
using alilexba_backend.DTOs;
using alilexba_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniExcelLibs;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace alilexba_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Lấy toàn bộ câu hỏi kèm đáp án
        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            var questions = await _context.Questions
                .Include(q => q.Answers)
                .ToListAsync();
            return Ok(questions);
        }

        // 2. Thêm câu hỏi lẻ thủ công
        [HttpPost]
        public async Task<IActionResult> AddQuestion([FromBody] Question question)
        {
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == question.SubjectId);
            if (!subjectExists) return BadRequest(new { message = "Môn học không tồn tại!" });

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã thêm câu hỏi thành công!", questionId = question.Id });
        }

        // ---------------------------------------------------------
        // NHÓM IMPORT (NHẬP FILE)
        // ---------------------------------------------------------

        // 3. Nhập hàng loạt từ Excel
        [HttpPost("upload-excel")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadExcel([FromForm] UploadExcelRequest request, [FromQuery] int subjectId)
        {
            try
            {
                if (request.File == null || request.File.Length == 0) return BadRequest("Vui lòng chọn file Excel!");

                using (var stream = request.File.OpenReadStream())
                {
                    var rows = stream.Query<QuestionExcelModel>().ToList();
                    if (!rows.Any()) return BadRequest("File Excel trống!");

                    foreach (var row in rows)
                    {
                        var newQuestion = new Question
                        {
                            Content = row.Content ?? "N/A",
                            SubjectId = subjectId,
                            Answers = new List<Answer>()
                        };

                        string correct = row.CorrectOption?.Trim().ToUpper() ?? "";
                        newQuestion.Answers.Add(new Answer { Text = row.OptionA ?? "", IsCorrect = correct == "A" });
                        newQuestion.Answers.Add(new Answer { Text = row.OptionB ?? "", IsCorrect = correct == "B" });
                        newQuestion.Answers.Add(new Answer { Text = row.OptionC ?? "", IsCorrect = correct == "C" });
                        newQuestion.Answers.Add(new Answer { Text = row.OptionD ?? "", IsCorrect = correct == "D" });

                        _context.Questions.Add(newQuestion);
                    }
                    await _context.SaveChangesAsync();
                    return Ok(new { message = $"Đã nhập {rows.Count} câu hỏi từ Excel." });
                }
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        // 4. Nhập hàng loạt từ file Word (.docx)
        [HttpPost("upload-word")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadWord([FromForm] UploadExcelRequest request, [FromQuery] int subjectId)
        {
            try
            {
                if (request.File == null || !request.File.FileName.EndsWith(".docx")) return BadRequest("Vui lòng chọn file .docx!");

                string fullText = "";
                using (var stream = request.File.OpenReadStream())
                using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(stream, false))
                {
                    var paragraphs = wordDoc.MainDocumentPart!.Document!.Body!.Elements<Paragraph>().Select(p => p.InnerText);
                    fullText = string.Join("\n", paragraphs);
                }

                string[] blocks = Regex.Split(fullText, @"Câu\s+\d+\s*:", RegexOptions.IgnoreCase);
                int successCount = 0;

                foreach (var block in blocks)
                {
                    if (string.IsNullOrWhiteSpace(block)) continue;
                    var matchContent = Regex.Match(block, @"^(.*?)(?=A\.)", RegexOptions.Singleline);
                    var matchA = Regex.Match(block, @"A\.(.*?)(?=B\.)", RegexOptions.Singleline);
                    var matchB = Regex.Match(block, @"B\.(.*?)(?=C\.)", RegexOptions.Singleline);
                    var matchC = Regex.Match(block, @"C\.(.*?)(?=D\.)", RegexOptions.Singleline);
                    var matchD = Regex.Match(block, @"D\.(.*?)(?=Đáp án:)", RegexOptions.Singleline | RegexOptions.IgnoreCase);
                    var matchCorrect = Regex.Match(block, @"Đáp án:\s*([A-D])", RegexOptions.IgnoreCase);

                    if (matchContent.Success && matchCorrect.Success)
                    {
                        var correctLetter = matchCorrect.Groups[1].Value.ToUpper();
                        var newQuestion = new Question
                        {
                            Content = matchContent.Groups[1].Value.Trim(),
                            SubjectId = subjectId,
                            Answers = new List<Answer>
                            {
                                new Answer { Text = matchA.Groups[1].Value.Trim(), IsCorrect = correctLetter == "A" },
                                new Answer { Text = matchB.Groups[1].Value.Trim(), IsCorrect = correctLetter == "B" },
                                new Answer { Text = matchC.Groups[1].Value.Trim(), IsCorrect = correctLetter == "C" },
                                new Answer { Text = matchD.Groups[1].Value.Trim(), IsCorrect = correctLetter == "D" }
                            }
                        };
                        _context.Questions.Add(newQuestion);
                        successCount++;
                    }
                }
                await _context.SaveChangesAsync();
                return Ok(new { message = $"Đã nhập {successCount} câu hỏi từ Word." });
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        // ---------------------------------------------------------
        // NHÓM EXPORT (XUẤT FILE)
        // ---------------------------------------------------------

        // 5. Xuất ngân hàng câu hỏi ra Excel
        [HttpGet("export-excel/{subjectId}")]
        public async Task<IActionResult> ExportExcel(int subjectId)
        {
            var questions = await _context.Questions.Where(q => q.SubjectId == subjectId).Include(q => q.Answers).ToListAsync();
            if (!questions.Any()) return NotFound("Không có dữ liệu.");

            var exportData = questions.Select(q => new {
                Content = q.Content,
                OptionA = q.Answers.ElementAtOrDefault(0)?.Text,
                OptionB = q.Answers.ElementAtOrDefault(1)?.Text,
                OptionC = q.Answers.ElementAtOrDefault(2)?.Text,
                OptionD = q.Answers.ElementAtOrDefault(3)?.Text,
                CorrectOption = ((char)(65 + q.Answers.ToList().FindIndex(a => a.IsCorrect))).ToString()
            });

            var memoryStream = new MemoryStream();
            memoryStream.SaveAs(exportData);
            memoryStream.Seek(0, SeekOrigin.Begin);
            return File(memoryStream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Questions_Subject_{subjectId}.xlsx");
        }

        // 6. Xuất ngân hàng câu hỏi ra Word
        [HttpGet("export-word/{subjectId}")]
        public async Task<IActionResult> ExportWord(int subjectId)
        {
            var questions = await _context.Questions.Where(q => q.SubjectId == subjectId).Include(q => q.Answers).ToListAsync();
            if (!questions.Any()) return NotFound("Không có dữ liệu.");

            var memoryStream = new MemoryStream();
            using (WordprocessingDocument wordDoc = WordprocessingDocument.Create(memoryStream, DocumentFormat.OpenXml.WordprocessingDocumentType.Document))
            {
                MainDocumentPart mainPart = wordDoc.AddMainDocumentPart();
                mainPart.Document = new Document(new Body());
                Body body = mainPart.Document.Body!;

                int i = 1;
                foreach (var q in questions)
                {
                    body.AppendChild(new Paragraph(new Run(new Text($"Câu {i}: {q.Content}"))));
                    char label = 'A';
                    foreach (var ans in q.Answers)
                    {
                        body.AppendChild(new Paragraph(new Run(new Text($"{label}. {ans.Text}"))));
                        label++;
                    }
                    var correctIdx = q.Answers.ToList().FindIndex(a => a.IsCorrect);
                    body.AppendChild(new Paragraph(new Run(new Text($"Đáp án: {(char)(65 + correctIdx)}")) { RunProperties = new RunProperties(new Bold()) }));
                    body.AppendChild(new Paragraph(new Run(new Text(""))));
                    i++;
                }
                mainPart.Document.Save();
            }
            memoryStream.Seek(0, SeekOrigin.Begin);
            return File(memoryStream, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", $"Questions_Subject_{subjectId}.docx");
        }
    }
    public class QuestionExcelModel
    {
        public string? Content { get; set; }
        public string? OptionA { get; set; }
        public string? OptionB { get; set; }
        public string? OptionC { get; set; }
        public string? OptionD { get; set; }
        public string? CorrectOption { get; set; }
    }
}