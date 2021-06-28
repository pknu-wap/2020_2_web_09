import puppeteer from"puppeteer";
import dotenv from"dotenv";

dotenv.config();

const detailPath = `#shedule_list_form > div > .schedule_view_detail_box`;
const contentPath = "#shedule_list_form > div > .schedule_view_list_box";
const dateRe = /\d+\.\d+.\d+/;
const subjectNameRe = /[a-zA-Z가-힣]+/;

const getAssignment = async (pknu_id, pknu_pw, cb) => {
  const data = [];
  const browser = await puppeteer.launch({
    // headless: false,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 1000,
  });

  async function evaluate(dom) {
    return await page.evaluate((box) => {
      if (box == null) return null;
      return box.innerText;
    }, dom);
  }

  await page.goto("https://lms.pknu.ac.kr/ilos/main/member/login_form.acl",
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
    console.log("실패");
  } else {
    await page.goto("https://lms.pknu.ac.kr/ilos/main/main_form.acl",
    {waitUntil: 'domcontentloaded'}
    );
    await page.waitFor(1000);
    await page.click('div[class="x"]').catch((err) => {
      console.log(err+"site button")
    });
    await page
      .click('input[id="show_schedule_list"]')
      .catch((err) => {
        console.log(err+"schedule button")
      })
      .finally(() => {
        setTimeout(async () => {
          let number = await page.$$eval(
            "#shedule_list_form > div > *",
            (data) => {
              return data.length;
            }
          );

          let box = new Object();
          for (let i = 1; i <= number; i++) {
            // console.log(i);
            const contentDom = await page.$(
              `${contentPath}:nth-child(${i}) > div:nth-child(2) > span`
            );
            if (contentDom != null) {
              const content = await evaluate(contentDom);
              box.content = content;
              continue;
            }

            const subjectInfo = await page.$(`${detailPath}:nth-child(${i})`);
            if (subjectInfo != null) {
              const subjectDom = await page.$(
                `${detailPath}:nth-child(${i}) > div:nth-child(2) > a > div:nth-child(1)`
              );
              const dateDom = await page.$(
                `${detailPath}:nth-child(${i}) > div:nth-child(2) > a > div:nth-child(2)`
              );
              const stateDom =
                (await page.$(
                  `${detailPath}:nth-child(${i}) > div:nth-child(2) > a > div:nth-child(4)`
                )) ||
                (await page.$(
                  `${detailPath}:nth-child(${i}) > div:nth-child(2) > a > div:nth-child(5)`
                ));

              const subjectName = await evaluate(subjectDom);
              const date = await evaluate(dateDom);
              const state = await evaluate(stateDom);
              if (subjectName != null) {
                if (state && state.split(":")[1].trim() == "제출") continue;
                box.date = dateRe.exec(date)[0].replace(/\./gi, '-');
                box.subjectName = subjectNameRe.exec(subjectName)[0];
                data.push(box);
              }
            }

            box = new Object();
          }

          await browser.close();
          return cb(data, null);
        }, 1000);
      });
  }
};

export { getAssignment };
