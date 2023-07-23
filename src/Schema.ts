// 定义排序类型
export type SortType = "recommend" | "latest";

// 定义文章类型
export type ArticleType = "frontend" | "backend" | "android" | "ios" | "ai";

// 定义函数，获取文章列表
export type API = {
  getArticles(
    sortType: SortType,
    limit: number,
    categoryId?: ArticleType
  ): void;
};
