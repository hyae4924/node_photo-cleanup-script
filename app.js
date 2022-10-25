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
  fs.existsSync(video_dir_path) || fs.mkdirSync(video_dir_path);
  fs.existsSync(captured_dir_path) || fs.mkdirSync(captured_dir_path);
  fs.existsSync(duplicated_dir_path) || fs.mkdirSync(duplicated_dir_path);
} catch (err) {
  console.error(err);
}

// 3. mp4,mov => video 폴더로이동
// 4. png, aae => captured 폴더로 이동
// 5. IMG_---.jpg 파일의 수정파일(IMG_E---.jpg)이 있는경우
//   원본사진(IMG_---.jpg)만 duplicated로 이동
const isVideoFile = file => {
  const regex1 = /mp4/;
  const regex2 = /mov/;
  if (regex1.test(file) || regex2.test(file)) return true;
};
const isCapturedFile = file => {
  const regex1 = /png/;
  const regex2 = /aae/;
  if (regex1.test(file) || regex2.test(file)) return true;
};

const isDuplicatedFile = file => {
  const regex1 = /IMG_E/;
  if (regex1.test(file)) return true;
};

const findOriginal = file => {
  const regex = new RegExp(file.split("IMG_E")[1]);
  const finded = target_file_list.find(item => {
    return regex.test(item);
  });
  return finded;
};

const target_file_list = fs.readdirSync(target_dir_Path);

target_file_list.forEach(file => {
  if (isVideoFile(file)) {
    fs.renameSync(
      path.join(target_dir_Path, file),
      path.join(video_dir_path, file)
    );
  } else if (isCapturedFile(file)) {
    fs.renameSync(
      path.join(target_dir_Path, file),
      path.join(captured_dir_path, file)
    );
  } else if (isDuplicatedFile(file)) {
    const original = findOriginal(file);
    fs.renameSync(
      path.join(target_dir_Path, original),
      path.join(duplicated_dir_path, original)
    );
  }
});

// 이번에 새로 써본 API
//  os.homedir()  홈디렉토리
// fs.existsSync() 존재하는 경로? =>파일이나 디렉토리 유무확인
// 정규표현식 => 포함여부확인에 좋음
