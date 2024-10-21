import {
  ConnectDB
} from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import {
  Octokit
} from "@octokit/rest";
import {
  NextResponse
} from "next/server";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();

// GitHub에 이미지 업로드 함수
async function uploadImageToGitHub(imageBuffer, fileName) {
  try {
    const content = imageBuffer.toString('base64');

    const response = await octokit.repos.createOrUpdateFileContents({
      owner: "drvince00",
      repo: "gs-blog",
      path: `public/${fileName}`,
      message: `Add image ${fileName}`,
      content: content,
      branch: "main"
    });

    return `https://raw.githubusercontent.com/drvince00/gs-blog/main/public/${fileName}`;
  } catch (error) {
    // console.error("GitHub에 이미지 업로드 중 오류 발생:", error);
    // throw error;
    console.error('Detailed GitHub API error:', JSON.stringify(error, null, 2));
    throw error;
  }
}

// GitHub에서 파일 삭제 함수
async function deleteFileFromGitHub(filePath) {
  try {
    const {
      data: fileData
    } = await octokit.repos.getContent({
      owner: "drvince00",
      repo: "gs-blog",
      path: filePath,
    });

    await octokit.repos.deleteFile({
      owner: "drvince00",
      repo: "gs-blog",
      path: filePath,
      message: `Delete image ${filePath}`,
      sha: fileData.sha,
      branch: "main"
    });

    console.log(`File ${filePath} deleted from GitHub`);
  } catch (error) {
    console.error("GitHub에서 파일 삭제 중 오류 발생:", error);
  }
}

// API Endpoint to get all blogs
export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");

  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  } else {
    const blogs = await BlogModel.find({})
    return NextResponse.json({
      blogs
    });
  }
}

// API Endpoint for Uploading Blogs
export async function POST(request) {
  const formData = await request.formData();
  const timestamp = Date.now();

  const image = formData.get('image');
  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const fileName = `${timestamp}_${image.name}`;
  const imgUrl = await uploadImageToGitHub(buffer, fileName);

  const blogData = {
    title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      author: formData.get('author'),
      image: imgUrl,
      authorImg: formData.get('authorImg')
  }

  console.log('BlogData:', blogData);

  await BlogModel.create(blogData);
  console.log("Blog Saved")

  return NextResponse.json({
    success: true,
    msg: "Blog Added"
  })
}

// API Endpoint for Deleting Blogs
export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await BlogModel.findById(id);

  if (blog && blog.image) {
    const imagePath = new URL(blog.image).pathname;
    const filePathInRepo = imagePath.split('/').slice(4).join('/');
    await deleteFileFromGitHub(filePathInRepo);
  }

  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({
    msg: "Blog and associated image deleted."
  });
}