import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.
const prisma = new PrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, 해당하는 SQL을 출력해줍니다. /
  log: ['query', 'info', 'warn', 'error'],

  // pretty - 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
  errorFormat: 'pretty',
}); // PrismaClient 인스턴스를 생성합니다.

// 게시글 작성 API
router.post('/posts', async (req, res, next) => {
  const { title, content } = req.body;
  const post = await prisma.posts.create({
    data: {
      title,
      content,
    },
  });

  const ResPost = await prisma.posts.findUnique({
    where: { id: post.id },
    select: {
      postId: true,
      title: true,
      content: true,
    },
  });

  return res.status(201).json({ data: ResPost });
});

// 게시글 전체 조회 API
router.get('/posts', async (req, res, next) => {
  try {
  const posts = await prisma.posts.findMany({
    select: {
      postId: true,
      title: true,
      content: true,
    },
    orderBy: { 
      createdAt: 'desc',
    },
  });

  return res.status(200).json({ data: posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: '게시글 조회에 실패했습니다.' });
  }
});

// 게시글 수정 API
router.put('/posts/:postId', async (req, res, next) => {
  try{
  const { postId } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(412)
      .send({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  const post = await prisma.posts.findUnique({
    where: { postId: +postId },
  });

  if (!post) {
    return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
  }

  await prisma.posts.update({
    data: { title, content },
    where: {
      postId: +postId,
    },
  });

  return res.status(200).json({ data: '게시글을 수정하였습니다.' });
  } catch (error){
    console.log(error);
    return res
      .status(400)
      .json({ message: '게시글 수정에 실패하였습니다.' });
  }
});

// 게시글 삭제 API
router.delete('/posts/:postId', async (req, res, next) => {
  try{
  const { postId } = req.params;

  const post = await prisma.posts.findUnique({
    where: { postId: +postId },
  });

  if (!post) {
    return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
  }

  await prisma.posts.delete({
    where: { postId: +postId },
  });
  return res.status(200).json({ data: '게시글을 삭제하였습니다.' });
  } catch (error){
    console.log(error);
    return res.status(400).json({ message: '게시글 삭제에 실패하였습니다.' });
  }
});
  

export default router;