import { useState } from "react";
import axios from "axios";

export function useAiRecommendations() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async (sessionData: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003",
          prompt: `Provide recommendations based on the following session data: ${JSON.stringify(
            sessionData
          )}`,
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
          },
        }
      );

      setRecommendations(response.data.choices[0].text.trim());
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      setRecommendations("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, loading, fetchRecommendations };
}
