import api from "@/services/common";

export const aiService = {
    // Dự đoán điểm
    predictScore: async () => {
        const res = await api.get("/AI/predict-score");
        return res.data;
    },

    // Giải thích chi tiết câu sai
    explainDetail: async (detailId: number) => {
        const res = await api.post(
            `/AI/explain-result-detail/${detailId}`
        );
        return res.data;
    },
};