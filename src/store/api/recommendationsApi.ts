import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  Recommendation,
  TrendingTopic,
  RecommendationsQueryParams,
  RecommendationsResponse,
  UserInteraction,
  InteractionsQueryParams,
} from '@/types/api';

export const recommendationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendations: builder.query<ApiResponse<RecommendationsResponse>, RecommendationsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        if (params.category) searchParams.append('category', params.category);
        if (params.content_type) searchParams.append('content_type', params.content_type);
        if (params.difficulty_level) searchParams.append('difficulty_level', params.difficulty_level);
        
        return {
          url: `/recommendations?${searchParams.toString()}`,
        };
      },
      providesTags: ['Recommendations'],
    }),
    
    getTrendingTopics: builder.query<ApiResponse<{ trending_topics: TrendingTopic[] }>, { limit?: number; category?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.category) searchParams.append('category', params.category);
        
        return {
          url: `/recommendations/trending-topics?${searchParams.toString()}`,
        };
      },
      providesTags: ['Recommendations'],
    }),
    
    getRecommendationsByCategory: builder.query<ApiResponse<{
      category: string;
      total: number;
      recommendations: Recommendation[];
      pagination: { limit: number; offset: number; total_pages: number };
    }>, { category: string; limit?: number; offset?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        
        return {
          url: `/recommendations/category/${params.category}?${searchParams.toString()}`,
        };
      },
      providesTags: ['Recommendations'],
    }),
    
    searchRecommendations: builder.query<ApiResponse<{
      query: string;
      total: number;
      recommendations: Recommendation[];
      pagination: { limit: number; offset: number; total_pages: number };
    }>, { q: string; limit?: number; offset?: number; category?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.append('q', params.q);
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        if (params.category) searchParams.append('category', params.category);
        
        return {
          url: `/recommendations/search?${searchParams.toString()}`,
        };
      },
      providesTags: ['Recommendations'],
    }),
    
    getCareerRecommendations: builder.query<ApiResponse<{
      career_topics: TrendingTopic[];
      recommendations: Recommendation[];
    }>, { limit?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return {
          url: `/recommendations/career?${searchParams.toString()}`,
        };
      },
      providesTags: ['Recommendations'],
    }),
    
    getRecommendationsForTopic: builder.query<ApiResponse<{
      topic: TrendingTopic;
      recommendations: Recommendation[];
    }>, { topicId: string; limit?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return {
          url: `/recommendations/topic/${params.topicId}?${searchParams.toString()}`,
        };
      },
      providesTags: ['Recommendations'],
    }),
    
    getUserInteractions: builder.query<ApiResponse<{
      total: number;
      interactions: UserInteraction[];
      pagination: { limit: number; offset: number; total_pages: number };
    }>, InteractionsQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.offset) searchParams.append('offset', params.offset.toString());
        if (params.interaction_type) searchParams.append('interaction_type', params.interaction_type);
        
        return {
          url: `/recommendations/interactions?${searchParams.toString()}`,
        };
      },
      providesTags: ['Recommendations'],
    }),
    
    recordInteraction: builder.mutation<ApiResponse<{
      interaction: {
        id: string;
        user_id: string;
        recommendation_id: string;
        interaction_type: string;
        rating: number | null;
        time_spent_minutes: number | null;
        completion_percentage: number | null;
        feedback: string | null;
        recommended_at: string;
        interacted_at: string;
      };
    }>, {
      recommendationId: string;
      interaction_type: 'viewed' | 'clicked' | 'liked' | 'saved' | 'completed' | 'dismissed';
      rating?: number;
      time_spent_minutes?: number;
      completion_percentage?: number;
      feedback?: string;
    }>({
      query: ({ recommendationId, ...body }) => ({
        url: `/recommendations/interactions/${recommendationId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Recommendations'],
    }),
    
    getCategories: builder.query<ApiResponse<{ categories: Array<{ value: string; label: string }> }>, void>({
      query: () => '/recommendations/meta/categories',
      providesTags: ['Recommendations'],
    }),
    
    getContentTypes: builder.query<ApiResponse<{ content_types: Array<{ value: string; label: string }> }>, void>({
      query: () => '/recommendations/meta/content-types',
      providesTags: ['Recommendations'],
    }),
    
    getRecommendationStats: builder.query<ApiResponse<{
      total_recommendations: number;
      total_trending_topics: number;
      total_interactions: number;
      popular_categories: Array<{ category: string; count: number }>;
      most_interacted: Array<{
        recommendation_id: string;
        interaction_count: number;
        Recommendation: {
          title: string;
          category: string;
          content_type: string;
        };
      }>;
    }>, void>({
      query: () => '/recommendations/stats',
      providesTags: ['Recommendations'],
    }),
  }),
});

export const {
  useGetRecommendationsQuery,
  useGetTrendingTopicsQuery,
  useGetRecommendationsByCategoryQuery,
  useSearchRecommendationsQuery,
  useGetCareerRecommendationsQuery,
  useGetRecommendationsForTopicQuery,
  useGetUserInteractionsQuery,
  useRecordInteractionMutation,
  useGetCategoriesQuery,
  useGetContentTypesQuery,
  useGetRecommendationStatsQuery,
} = recommendationsApi;

