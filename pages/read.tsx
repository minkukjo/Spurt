import deleteQuestion from '@/apis/Questions/deleteQuestion';
import { Question } from '@/apis/Questions/fetchQuestion';
import fetchQuestionById from '@/apis/Questions/fetchQuestionById';
import CTA4 from '@/components/pc/Keywords/Buttons/CTA4';
import { allCategoryMaps } from '@/const/categories';
import ArrowRightIcon from '@/img/arrow-right-circle-yellow-54.svg';
import EditIcon from '@/img/edit-16.svg';
import CircleIcon from '@/img/question-circle-4.svg';
import DelIcon from '@/img/trash-16.svg';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ReadPost = () => {
  const router = useRouter();
  const { postId } = router.query;

  const [project, setProject] = useState(false);
  const [qId, setQId] = useState<string>('');
  const [myPost, setMyPost] = useState<Question>();

  const goBack = () => {
    router.back();
  };

  const handleDelete = () => {
    deleteQuestion(qId)
      .then((v) => {
        console.log('삭제 성공');
      })
      .then((v) => goBack());
  };

  const handleEdit = () => {
    router.push({ pathname: '/post', query: { paramQuestionId: postId } });
  };

  useEffect(() => {
    setQId(postId as string);
    async function getPostById() {
      if (qId) {
        const result = await fetchQuestionById(qId);
        if (result !== null) setMyPost(result);
      }
    }
    getPostById();
  }, [qId, postId]);

  return (
    <>
      <div className="absolute top-0 left-0 bottom-0 w-full bg-main-100 h-[293px] border-b border-b-main-400"></div>

      <div className="absolute w-[1000px]">
        <div className="flex justify-start h-[54px] mt-6">
          <button onClick={goBack}>
            <ArrowRightIcon />
          </button>
        </div>

        <div className="flex flex-row mt-[82px] mb-[10px] text-heading1 text-main-500">
          {project && (
            <p className="text-heading1 text-gray-500">
              사이드 프로젝트 : SPURT {'>'}&nbsp;{' '}
            </p>
          )}

          {myPost?.categoryList.length === 2 ? (
            <div className="flex flex-row items-center gap-2">
              {myPost?.categoryList[0] && myPost?.categoryList[1]
                ? allCategoryMaps.get(myPost?.categoryList[0])?.name
                : '없음'}
              <CircleIcon />{' '}
              {allCategoryMaps.get(myPost?.categoryList[1])?.name}
            </div>
          ) : (
            <>
              {myPost?.categoryList[0] ? (
                allCategoryMaps.get(myPost?.categoryList[0])?.name
              ) : (
                <></>
              )}
            </>
          )}
        </div>
        <p className="mb-[50px] text-title1 text-gray-700">{myPost?.subject}</p>

        <div className="mt-[110px] mb-[30px] text-gray-600">
          {myPost?.mainText}
        </div>
        <div className="flex gap-2 flex-wrap mb-[40px]">
          {myPost?.keyWordList?.map((item, index) => {
            return (
              <div
                key={index}
                className="text-body6 text-gray-600 px-[14px] py-2 bg-main-200 border border-keyword_border rounded-[5px]"
              >
                {item}
              </div>
            );
          })}
        </div>
        <div>
          <p className="text-body6 text-gray-400 mb-[50px]">
            {myPost?.createTime.slice(0, 10)}
          </p>
        </div>
        <div className="mb-[150px] flex w-full justify-end gap-[10px]">
          <CTA4
            className="gap-1 text-body2 bg-white text-gray-500 py-[10px] pl-[16px] pr-[14px] flex justify-center items-center rounded-[12px] border-gray_line border"
            onClick={handleDelete}
          >
            삭제하기 <DelIcon />
          </CTA4>
          <CTA4 onClick={handleEdit}>
            수정하기 <EditIcon />
          </CTA4>
        </div>
        {project && (
          <div className="mt-[-100px] mb-[150px]">
            <hr />
            <div className="flex flex-row justify-between mt-[30px]">
              <p className="text-heading2 text-main-500">
                기업적 디자인 스튜디오 : 언어재활 환자를 위한 홈 Iot 서비스
              </p>
              <p className="text-body2 text-gray-700">총 {10}개</p>
            </div>
            <p className="text-title8 text-gray-700 mb-[30px]">다른 예상질문</p>
            <div className="border border-red h-[192px]">캐러셀 자리</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReadPost;
