import { Experience } from '@/apis/Experience/fetchExperience';
import createPost from '@/apis/Questions/createPost';
import { Question } from '@/apis/Questions/fetchQuestion';
import fetchQuestionById from '@/apis/Questions/fetchQuestionById';
import updateQuestionById from '@/apis/Questions/updateQuestionById';
import CTA4 from '@/components/pc/Keywords/Buttons/CTA4';
import SumKeyWord from '@/components/pc/Keywords/Buttons/Keyword';
import AddKeyWordBtn from '@/components/pc/Keywords/Buttons/addKeyword';
import PostCarousel from '@/components/pc/Keywords/Carousel/PostCarousel';
import QuickEditor from '@/components/pc/Keywords/Editor';
import BackGuide from '@/components/pc/Keywords/Modals/BackGuide';
import SaveGuide from '@/components/pc/Keywords/Modals/SaveGuide';
import { Category, postCategory } from '@/const/categories';
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
  const { subject, paramExperienceId, paramQuestionId } = router.query;

  const [questionId, setQuestionId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentCount, setContentCount] = useState(0);
  const [project, setProject] = useState('');
  const [experienceId, setExperienceId] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [categoryCount, setCategoryCount] = useState(0);
  const [inputItems, setInputItems] = useState<string[]>([]);

  const [myEdit, setMyEdit] = useState<Question>();

  const [postCategories, setPostCategories] = useState(
    postCategory.map((category) => {
      return new PostCategory(category, false);
    }),
  );

  const [keyword, setKeyword] = useRecoilState(keywordState);

  useEffect(() => {
    async function fillContent() {
      if (subject) {
        setTitle(subject as string);
      }
      if (questionId) {
        const res = await fetchQuestionById(questionId);
        if (res !== null) {
          setTitle(res.subject);
          setContent(res.mainText);
          setContentCount(res.mainText.length);
          setInputItems(res.keyWordList);
          const postCategories = postCategory.map((category) => {
            const categories = res.categoryList;
            const isSelected = categories.includes(category.code)
              ? true
              : false;
            return new PostCategory(category, isSelected);
          });
          setPostCategories(postCategories);
        }
      }
    }

    if (subject) {
      fillContent();
    }

    if (paramExperienceId) {
      //setProject(exp as string);
      console.log(paramExperienceId);
    }
    if (paramExperienceId) setExperienceId(paramExperienceId as string);
    if (paramQuestionId) {
      fillContent();
      setQuestionId(paramQuestionId as string);
    }

    localStorage.setItem('keywords', JSON.stringify(inputItems));
  }, [
    experienceId,
    paramExperienceId,
    paramQuestionId,
    questionId,
    inputItems,
  ]);

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeContent = (text: string) => {
    setContent(text);
    setContentCount(text.length);
  };

  const showSaveModal = () => {
    setShowSave(!showSave);
  };
  const showBackModal = () => {
    setShowBack(!showBack);
  };

  const handleCategories = (categories: PostCategory[]) => {
    setCategoryCount(0);
    setPostCategories(categories);
    categories.map((item) => {
      if (item.isSelected !== false) {
        setCategoryCount(categoryCount + 1);
      }
    });
  };

  const handlePost = async () => {
    if (!paramQuestionId) {
      //질문 등록
      await callPostCreationApi().then(() => {
        showSaveModal();
      });
    } else {
      //질문 수정
      await callPostEditApi().then(() => {
        showSaveModal();
      });
    }
  };

  const callPostCreationApi = async () => {
    //질문 등록
    var result = '';
    if (!experienceId) {
      result = await createPost({
        subject: title,
        mainText: content,
        keyWordList: inputItems,
        categoryList: postCategories
          .filter((value) => value.isSelected)
          .map((value) => value.category.code),
      });
    } else {
      result = await createPost({
        subject: title,
        mainText: content,
        keyWordList: inputItems,
        categoryList: postCategories
          .filter((value) => value.isSelected)
          .map((value) => value.category.code),
        experienceId: +experienceId,
      });
    }
    return result;
  };

  const callPostEditApi = async () => {
    //질문 수정
    await updateQuestionById({
      questionId: paramQuestionId as string,
      subject: title,
      mainText: content,
      keyWordList: inputItems,
      categoryList: postCategories
        .filter((value) => value.isSelected)
        .map((value) => value.category.code),
    });
  };

  const goBack = () => {
    if (!title && !content) {
      router.back();
    } else {
      showBackModal();
    }
  };

  const addInput = () => {
    const hasEmptyKeyword = inputItems.find((value) => value === '');
    if (hasEmptyKeyword !== undefined || inputItems.length === 20) {
      return;
    }

    const items = [...inputItems, keyword];

    setInputItems(items);
  };

  const addKeyword = (selectedText: string) => {
    const obj = localStorage.getItem('keywords');
    if (obj !== null) {
      const keywords = [...(JSON.parse(obj) as string[]), selectedText];
      localStorage.setItem('keywords', JSON.stringify(keywords));
      setInputItems(keywords);
    }
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
    const test = inputItems.filter((item, index) => index !== deletedIndex);
    setInputItems(test);
  };

  return (
    <>
      <div className="flex justify-start h-[100px]">
        <button onClick={goBack}>
          <ArrowRightIcon />
        </button>
      </div>
      <div className="flex flex-row mt-[60px] mb-5 items-center">
        <p className="text-title1 mr-[16px]">질문-답변 만들기</p>
        {paramExperienceId && (
          <p className="pl-[12px] text-heading3 text-gray-600 border-l-2 border-l-main-300">
            {project}
          </p>
        )}
      </div>
      <div className="border border-gray-300 flex flex-col items-start rounded-2xl bg-white px-6 pt-[14px] pb-4 mb-3">
        <input
          className="text-heading3 text-gray-600 w-full  placeholder:text-heading3 mb-[14px] placeholder:text-gray-300 outline-none"
          placeholder="질문은 35자 이내로 작성해주세요"
          maxLength={35}
          onChange={onChangeTitle}
          value={title}
        ></input>
        <hr />
        <div className="flex mt-4">
          <PostCarousel
            postCateogries={postCategories}
            setPostCategories={handleCategories}
          ></PostCarousel>
        </div>
      </div>

      <div className="p-[30px] min-h-[476px] w-full border border-gray-300 rounded-[20px] bg-white">
        <QuickEditor
          text={content}
          setText={onChangeContent}
          addKeyword={addKeyword}
        ></QuickEditor>
        <p className="text-right text-body9 text-gray-300 mt-[30px] mb-[30px]">
          {contentCount} / 1000
        </p>
        <hr />
        <div className="flex items-center mt-[30px] mb-[20px] gap-[10px]">
          <p className="text-body1 text-gray-600">Keyword</p>
          <p className="text-caption2 text-gray-300">
            키워드는 최대 20개까지 가능해요
          </p>
        </div>
        {inputItems.length > 0 && (
          <div className="flex mb-[12px] gap-[6px] flex-wrap">
            {inputItems.map((item, index) => (
              <SumKeyWord
                key={item}
                defaultKeywordName={item}
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
        {(title.length > 0 && content.length > 0 && categoryCount > 0) ||
        paramQuestionId ? (
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
      {showSave && <SaveGuide setShow={() => showSaveModal()} />}
      {showBack && <BackGuide setShow={() => showBackModal()} />}
    </>
  );
};

export default Post;
