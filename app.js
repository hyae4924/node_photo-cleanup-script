// 1. 인자로 대상디렉토리를받는다
//  parth.join(os.homedir(),"pictures")안에 대상폴더가 있다고 가정
const path = require("path");
const os = require("os");
const fs = require("fs");
const folder = process.argv[2];
const target_dir_Path = path.join(os.homedir(), "pictures", folder);
if (!folder || !fs.existsSync(target_dir_Path))
  return console.error("enter target folder name in pictures ");

// 2. video/captured/duplicated 폴더생성
const video_dir_path = path.join(target_dir_Path, "video");
const captured_dir_path = path.join(target_dir_Path, "captured");
const duplicated_dir_path = path.join(target_dir_Path, "duplicated");
try {
  if (!fs.existsSync(video_dir_path)) fs.mkdirSync(video_dir_path);
  if (!fs.existsSync(captured_dir_path)) fs.mkdirSync(captured_dir_path);
  if (!fs.existsSync(duplicated_dir_path)) fs.mkdirSync(duplicated_dir_path);
} catch (err) {
  console.error(err);
}

// 3. mp4,mov => video 폴더로이동
// 4. png, aae => captured 폴더로 이동
// 5. IMG_---.jpg 파일의 수정파일(IMG_E---.jpg)이 있는경우
//   원본사진(IMG_---.jpg)만 duplicated로 이동
const list = fs.readdirSync(target_dir_Path);
list.forEach(file => {
  const extension = file.split(".")[1];
  if (extension === "mov" || extension === "mp4") {
    fs.renameSync(
      path.join(target_dir_Path, file),
      path.join(video_dir_path, file)
    );
  } else if (extension === "png" || extension === "aae") {
    fs.renameSync(
      path.join(target_dir_Path, file),
      path.join(captured_dir_path, file)
    );
  } else if (extension === "jpg") {
    let change = list.find(item => {
      if (item.split("_")[1] === "E" + file.split("_")[1]) return true;
    });
    if (change)
      fs.renameSync(
        path.join(target_dir_Path, file),
        path.join(duplicated_dir_path, file)
      );
  }
});

// 이번에 새로 써본 API
//  os.homedir()  홈디렉토리
// fs.existsSync() 존재하는 경로? =>파일이나 디렉토리 유무확인
