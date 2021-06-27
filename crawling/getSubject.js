import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

const titleRe = /[a-zA-Z가-힣]+/;

const getInfo = async (pknu_id, pknu_pw, cb) => {
  const data = [];
  const browser = await puppeteer.launch({
    headless : false
  });

  const page = await browser.newPage();
  await page.setViewport({
      width: 1000,
      height: 1080
  });

  await page.goto(
    "https://lms.pknu.ac.kr/ilos/main/member/login_form.acl",
    {waitUntil: 'domcontentloaded'}
  );
  await page.evaluate(
    (id, pw) => {
      document.querySelector('input[name="usr_id"]').value = id;
      document.querySelector('input[name="usr_pwd"]').value = pw;
    },
    pknu_id,
    pknu_pw
  );
  await page.click('div[id="login_btn"]');
  await page.waitFor(1000); 
  if (page.url() === "https://lms.pknu.ac.kr/ilos/main/member/login_form.acl") {
    console.log(page.url());
    console.log("실패");
  } else {
    await page.goto(
      "https://lms.pknu.ac.kr/ilos/mp/course_register_list_form.acl",
      {waitUntil: 'domcontentloaded'}
    );

    await page.click('div[id="onceLecture"]').catch((err) => {
      return cb(null, err);
    });
    let number = await page.$$eval(
      "#lecture_list > div > div > *",
      (data) => data.length
    );

    for (let i = 1; i <= number; i++) {
      let dom = await page.$(
        `#lecture_list > div > div > .content-container:nth-child(${i})`
      );
      if (dom == null) continue;
      const nameDom = await page.$(
        `#lecture_list > div > div > .content-container:nth-child(${i}) > div > a > span`
      );
      let name = await page.evaluate((nameDom) => {
        if (nameDom == null) return null;
        return nameDom.innerText;
      }, nameDom);

      if (name != null) data.push(titleRe.exec(name)[0]);
    }
  }

  await browser.close();
  return cb(data, null);
};



export { getInfo };

