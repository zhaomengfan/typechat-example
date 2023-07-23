import { ArticleType, SortType } from "./Schema";
const baseUrl = "https://api.juejin.cn/recommend_api/v1";
const getArticles = "/article/recommend_all_feed";
const getArticlesById = "/article/recommend_cate_feed";

const requestArticles = async (
  sortType: SortType,
  limit: number,
  categoryId?: ArticleType
): Promise<any> => {
  const url = baseUrl + (categoryId ? getArticlesById : getArticles);
  const params: any = {
    cursor: "0",
    limit,
    sort_type: sortType,
  };
  categoryId && (params["cate_id"] = categoryId);
  // console.log(url, params);
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { requestArticles };
