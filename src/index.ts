import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import {
  createLanguageModel,
  processRequests,
  createProgramTranslator,
  evaluateJsonProgram,
  getData,
} from "typechat";
import { requestArticles } from "./api";

const sortTypeMap = {
  recommend: 200,
  latest: 300,
};
const articleTypeMap = {
  frontend: "6809637767543259144",
  backend: "6809637769959178254",
  android: "6809635626879549454",
  ios: "6809c635626661445640",
  ai: "6809637773935378440",
};

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "Schema.ts"),
  "utf8"
);
// 创建一个对象，该对象可以将自然语言请求转换为JSON
const translator = createProgramTranslator(model, schema);
// 以交互方式或从命令行上指定的输入文件处理请求
processRequests("说你想干嘛--->", process.argv[2], async (request) => {
  // 将自然语言请求转换为T类型的对象。
  const response = await translator.translate(request);
  if (!response.success) {
    console.error(response.message);
    return;
  }
  const program = response.data;
  // 我想看看前端的新文章
  console.log(JSON.stringify(response.data, null, 2), "program");
  // 将JSON转换为TypeScript代码以进行验证。
  // 如果转换成功，则返回一个Success＜string＞对象；如果JSON无法转换，则返回Error对象。
  console.log(getData(translator.validator.createModuleTextFromJson(program)));
  /**
   * 使用简单的解释器评估JSON程序。函数调用会被传递给第二个参数onCall回调函数进行调度。
   * @param program 要评估的JSON程序
   * @param onCall 用于处理程序中函数调用的回调函数
   * @returns 返回一个promise
   */
  const result: any = await evaluateJsonProgram(program, handleCall);

  const resultArr: { title: string; content: string }[] = [];
  result.map((item: any) => {
    resultArr.push(
      item.item_info
        ? item.item_info.article_info?.title
        : item.article_info?.title
    );
  });
  console.log(`Result: ${resultArr}`);
});

/**
 * 获取解析后的函数和参数
 * @param func
 * @param args
 * @returns
 */
const handleCall = async (func: string, args: any[]): Promise<any> => {
  console.log(func, "func");
  console.log(args, "args");

  const sortType = sortTypeMap[args[0]];
  const limit = args[1];
  let categoryId = args[2] && articleTypeMap[args[2]];

  try {
    const res = await requestArticles(sortType, limit, categoryId);
    return res.data;
  } catch (err) {
    return err;
  }
};
