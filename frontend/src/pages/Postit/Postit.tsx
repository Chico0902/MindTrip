import React, { useState, useEffect } from "react";
import PostIt from "../../atoms/postit/postititem";
import PostitModal from "../../components/MyPostit/PostitModal";
import axios from "axios";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../components/Calendar/Calendar.module.css";
import { villageTextColor, villageBackgroundColor } from "../../atoms/color";
import { Button } from "@nextui-org/react";

export interface postitType {
  content: string;
  id: string;
  isLike: boolean;
  isReport: boolean;
  likeCount: number;
  reportCount: number;
  village:
  | "apple"
  | "orange"
  | "pineapple"
  | "watermelon"
  | "grape"
  | "peach"
  | "blueberry"
  | "kakao";
}

const PostitPage: React.FC = () => {
  const [postits, setPostits] = useState<postitType[]>([]);
  const [topic, setTopic] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("like"); // "like" 또는 "date"

  const [selectedFilter, setSelectedFilter] = useState("all");
  const formatDate = (date: Date | null): string => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const currentDate = new Date();
  const [startDate, setStartDate] = useState<Date | null>(currentDate);

  let member = useSelector((state: RootState) => state.member);
  let accessToken = useSelector((state: RootState) => state.accessToken.value);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://mindtrip.site/api/postits/v1?date=${formatDate(
          startDate
        )}&order=${sortBy}&village=all&page=0&size=10`, // sortBy가 like면 좋아요 순 정렬 아니면 최신순 정렬
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      setPostits(response.data.result.postitResList);
      setTopic(response.data.result.topic);
      setTopicId(response.data.result.topicId);
    } catch (error: any) {
      let errorMessage;
      switch (error.response?.data?.code) {
        case "B300":
          errorMessage = "존재하지 않는 주제입니다.";
          setStartDate(new Date());
          break;
        default:
          errorMessage = "알 수 없는 오류가 발생했습니다.";
      }

      Swal.fire({
        text: errorMessage,
        icon: "warning",
      });
      console.log("Error fetching missions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, sortBy]);

  const addPostit = async (content: string) => {
    try {
      const response = await axios.post(
        "https://mindtrip.site/api/postits/v1",
        {
          topicId: topicId,
          postitDate: formatDate(startDate),
          content: content,
          village: member.villageName,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      console.log(response.data);
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      let errorMessage;
      switch (error.response?.data?.code) {
        case "G011":
          errorMessage = "내용은 필수입니다.";
          break;
        case "B300":
          errorMessage = "존재하지 않는 주제입니다.";
          break;
        case "B302":
          errorMessage = "이미 포스트잇을 등록하였습니다.";
          break;
        case "B303":
          errorMessage = "오늘의 주제만 등록과 삭제가 가능합니다.";
          break;
        default:
          errorMessage = "알 수 없는 오류가 발생했습니다.";
      }

      Swal.fire({
        text: errorMessage,
        icon: "warning",
      });

      console.log("새 포스트잇 에러 :", error);
    }
  };

  const handleFirstPostitClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNewPostSubmit = (content: string) => {
    addPostit(content);
  };

  return (
    <div className={`${villageBackgroundColor[member.villageName]} px-2 min-h-screen`}>
      <Header />
      <div className="flex flex-col justify-center items-center mb-6">
        <div className="flex flex-row">
          <DatePicker
            dateFormat="yyyy.MM.dd"
            maxDate={currentDate}
            className={styles.datePicker}
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
          />
          <h1 className="text-center flex items-center justify-center">
            의 질문 보기
          </h1>
        </div>
        <h1 className="text-xl font-bold mt-10 w-4/5">{topic}</h1>
      </div>
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-5/6 md:w-4/5 mx-auto">
          <div className="flex mx-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="apple">사과</option>
              <option value="pineapple">파인애플</option>
              <option value="watermelon">수박</option>
              <option value="grape">포도</option>
              <option value="peach">복숭아</option>
              <option value="blueberry">블루베리</option>
              <option value="kakao">카카오</option>
            </select>
            <div className="p-2 w-4/5 mx-auto flex justify-end">
              <Button
                className={`${villageTextColor[member.villageName]} mx-1`}
                variant={sortBy === `like` ? `solid` : `ghost`}
                onClick={() => setSortBy("like")}
              >
                좋아요순
              </Button>
              <Button
                className={`${villageTextColor[member.villageName]}`}
                variant={sortBy === `date` ? `solid` : `ghost`}
                onClick={() => setSortBy("date")}
              >
                최신순
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center flex-wrap list-none">
            <div className="m-2">
              {formatDate(startDate) === formatDate(currentDate) && (
                <PostIt
                  accessToken={accessToken}
                  color={villageBackgroundColor[member.villageName]}
                  onClick={handleFirstPostitClick}
                  style={{ transition: "transform 0.3s ease-in-out" }}
                  firstData={true}
                >
                  눌러서 대답하기
                </PostIt>
              )}
            </div>
            {postits
              .filter(
                (item) =>
                  selectedFilter === "all" || item.village === selectedFilter
              )
              .map((postit) => (
                <div className="m-2" key={postit.id}>
                  <PostIt
                    accessToken={accessToken}
                    postItem={postit}
                    color={villageBackgroundColor[postit.village]}
                  >
                    {postit.content}
                  </PostIt>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-8 p-2 rounded-lg text-center w-4/5 mx-auto"></div>
      <PostitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleNewPostSubmit}
      />
    </div>
  );
};

export default PostitPage;
