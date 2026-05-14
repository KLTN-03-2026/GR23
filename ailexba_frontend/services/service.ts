import api from "@/services/common";

export const service = {
  getListSubject : async () => {
    const  response = await api.get("Subjects");

    return response.data;
  },

  getListExam : async () => {

    const  response = await api.get("Exams");

    return response.data;
  },

  getListQuestions: async (subjectId: number) => {
    console.log(subjectId);
    const  response = await api.get("Questions");
    const questions = response.data.questions;
    if(subjectId == 0)
    {
      return questions;
    }
    
    return questions.filter(
      (q: any) => q.subjectId === subjectId
    );
  }
};