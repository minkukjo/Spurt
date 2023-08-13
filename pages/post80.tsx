import issuePost from '@/apis/Questions/issuePost';
import CTA4 from '@/components/pc/Keywords/Buttons/CTA4';
import SumKeyWord from '@/components/pc/Keywords/Buttons/Keyword';
import AddKeyWordBtn from '@/components/pc/Keywords/Buttons/addKeyword';
import PostCarousel from '@/components/pc/Keywords/Carousel/PostCarousel';
import SaveGuide from '@/components/pc/Keywords/Modals/SaveGuide';
import { Category, allCategoryList, postCategory } from '@/const/categories';
import ArrowRightIcon from '@/img/arrow-right-circle-54.svg';
import SaveIcon from '@/img/check-16.svg';
import PlusIcon from '@/img/plus-16.svg';
import { keywordState } from '@/status/PostStatus';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

interface IPostCategory {
  category: Category;
  isSelected: boolean;
}

export class PostCategory implements IPostCategory {
  constructor(
    public category: Category,
    public isSelected: boolean,
  ) {}
}

const Post = () => {
  const router = useRouter();
  const {
    exp,
    paramQuestionId,
    paramTitle,
    paramContent,
    paramCategories,
    subject,
  } = router.query;

  const [questionId, setQuestionId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentCount, setContentCount] = useState(0);
  const [project, setProject] = useState('');
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    if (exp) setProject(exp as string);
    if (paramQuestionId) setQuestionId(paramQuestionId as string);
    if (paramTitle) setTitle(paramTitle as string);
    if (paramContent) setContent(paramContent as string);
    if (paramCategories) {
      const categoryNames = paramCategories as string[];
      const categories = allCategoryList.map((value) => {
        if (categoryNames.includes(value.code)) {
          return new PostCategory(value, true);
        } else {
          return new PostCategory(value, false);
        }
      });

      handleCategories(categories);
    }
    if (subject) setTitle(subject as string);
  }, [
    exp,
    paramQuestionId,
    paramTitle,
    paramContent,
    paramCategories,
    subject,
  ]);

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    setContentCount(
      event.target.value.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g, '$&$1$2')
        .length,
    );
  };

  const showModal = () => {
    setShowSave(!showSave);
  };

  const handlePost = () => {
    if (!exp) {
      console.log(inputItems);
      issuePost({
        subject: title,
        mainText: content,
        keyWordList: inputItems,
        categoryList: postCategories
          .filter((value) => value.isSelected)
          .map((value) => value.category.code),
      });
    } else {
      //TD: 프로젝트 관련 질문답변일 때
    }
    router.back();
  };

  const goBack = () => {
    if (!title && !content) {
      router.back();
    } else {
      showModal();
    }
  };

  const [inputItems, setInputItems] = useState<string[]>([]);

  const [postCategories, setPostCategories] = useState(
    postCategory.map((category) => {
      return new PostCategory(category, false);
    }),
  );

  const [keyword, setKeyword] = useRecoilState(keywordState);

  const addInput = () => {
    const hasEmptyKeyword = inputItems.find((value) => value === '');
    if (hasEmptyKeyword !== undefined || inputItems.length === 20) {
      return;
    }
    const items = inputItems.map((value) => value).concat(keyword);

    setInputItems(items);
  };

  const fixInput = (fixedIndex: number) => {
    const newInputItems = inputItems.map((value, index) => {
      if (fixedIndex === index) {
        return keyword;
      } else {
        return value;
      }
    });

    setInputItems(newInputItems);
  };
  const deleteInput = (deletedIndex: number) => {
    setInputItems(inputItems.filter((_, index) => index !== deletedIndex));
  };

  const handleCategories = (categories: PostCategory[]) => {
    setPostCategories(categories);
  };

  return (
    <>
      <div className="flex justify-start mt-[20px]">
        <button onClick={goBack}>
          <ArrowRightIcon />
        </button>
      </div>
      <div className="flex flex-row mt-[64px] mb-4 items-center">
        <p className="text-title7 mr-[16px]">질문-답변 만들기</p>
        {exp && (
          <p className="pl-[12px] text-heading3 text-gray-600 border-l-2 border-l-main-300">
            {project}
          </p>
        )}
      </div>
      <div className="w-[800px] border border-gray-300 flex flex-col items-start rounded-2xl bg-white px-6 pt-[12px] pb-[12px] mb-[10px]">
        <div className="w-full mb-[12px]">
          <input
            className="text-heading5 text-gray-700 w-full placeholder:text-heading5  placeholder:text-gray-300 outline-none"
            placeholder="질문은 35자 이내로 작성해주세요"
            maxLength={35}
            onChange={onChangeTitle}
            value={title}
          ></input>
        </div>
        <hr />
        <div className="flex">
          <PostCarousel
            postCateogries={postCategories}
            setPostCategories={handleCategories}
          ></PostCarousel>
        </div>
      </div>

      <div className="p-[30px] min-h-[444px] w-[800px] border border-gray-300 rounded-[20px] bg-white">
        <textarea
          className="min-h-[280px] w-[280px] text-heading5 text-gray-600 resize-none placeholder:text-body3 placeholder:text-gray-300 outline-none"
          placeholder="답변을 입력해주세요"
          maxLength={1000}
          onChange={onChangeContent}
          value={content}
        ></textarea>
        <p className="text-right text-body9 text-gray-300 mb-[30px]">
          {contentCount} / 1000
        </p>
        <hr />
        <div className="flex items-center mt-[30px] mb-[20px] gap-[10px]">
          <p className="text-body8 text-gray-600">Keyword</p>
          <p className="text-body10 text-gray-300">
            키워드는 최대 20개까지 가능해요
          </p>
        </div>
        {inputItems.length > 0 && (
          <div className="flex mb-[12px] gap-[6px] flex-wrap">
            {inputItems.map((item, index) => (
              <SumKeyWord
                key={index}
                fixInput={() => fixInput(index)}
                deleteInput={() => deleteInput(index)}
                index={index}
              />
            ))}
          </div>
        )}
        <div>
          <AddKeyWordBtn value="키워드 추가" addInput={() => addInput()}>
            키워드 추가
            <PlusIcon />
          </AddKeyWordBtn>
        </div>
      </div>

      <div className="flex justify-end mt-[30px] mb-[150px]">
        {title.length > 0 && content.length > 0 ? (
          <CTA4 onClick={handlePost}>
            저장하기
            <SaveIcon />
          </CTA4>
        ) : (
          <CTA4
            style={{
              backgroundColor: '#E9E9E9',
              color: '#A7A7A7',
              border: '1px solid #00000017',
            }}
            disabled={true}
          >
            저장하기
            <SaveIcon />
          </CTA4>
        )}
      </div>
      {showSave && (
        <SaveGuide
          setShow={() => {
            showModal();
          }}
        />
      )}
    </>
  );
};

export default Post;
