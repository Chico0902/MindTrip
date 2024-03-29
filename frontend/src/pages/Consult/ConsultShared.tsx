import { useState, useEffect } from 'react'
import { Select, SelectItem, Input } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import SharedConsult from '../../components/Consult/SharedConsult';
import SearchIcon from '../../atoms/Icons/SearchIcon';
import { categoryType, consultType } from '../../types/DataTypes';
import { useSelector } from "react-redux";
import { RootState } from './../../store/store'
import Header from '../../components/Header';
import { getSharedConsult } from '../../api/consults';
import Swal from 'sweetalert2';

function ConsultShared() {
  const navigate = useNavigate()

  // 카테고리 받기
  let category = useSelector((state: RootState) => state.consultSlice.category)
  let accessToken = useSelector((state: RootState) => state.accessToken)

  // 리스트
  const [shared, setShared] = useState<consultType[] | null>(null)

  // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState<categoryType | null>(null)
  const handleCategory = (e: any) => {
    setSelectedCategory(e.target.value)
    console.log(selectedCategory)
  }

  useEffect(() => {

    const navigate = useNavigate()

    // 로그인 안하면 막기
    useEffect(() => {
      if (accessToken === '') {
        Swal.fire({
          text:'로그인이 필요합니다.'
        }).then(() => {
          navigate('/login')
        })
      }
    }, [])

    // 전체 고민 가져오기
    const fetchConsult = async () => {
      try {
        let tempSharedConsult: consultType[] = await getSharedConsult(accessToken)
        setShared(tempSharedConsult)
        console.log(tempSharedConsult)
      } catch (err) {
        console.log(err)
      }
    }
    fetchConsult()
  }, [])

  return (
    <div className="w-full lg:w-3/4 mx-auto h-screen">
      <Header />
      <div className="px-3 min-h-[40%]">
        <p className="text-2xl hover:cursor-pointer" onClick={() => navigate('/consult/shared')}>🔍공유된 고민 상담들 둘러보기</p>
        <div className="flex items-center w-full mt-4 mb-2">
          {/* 카테고리들 */}
          <Select
            label='카테고리 선택'
            size='sm'
            onChange={handleCategory}
            className='w-[140px] mr-5'
            style={{ fontFamily: 'JamsilThin' }}
          >
            {category.map((oneCategory: categoryType) => {
              return (
                <SelectItem key={oneCategory.categoryId} style={{ fontFamily: 'JamsilThin' }}>
                  {oneCategory.categoryName}
                </SelectItem>
              )
            })
            }
          </Select>
          <Input
            isClearable
            variant='underlined'
            placeholder='검색'
            size='sm'
            startContent={
              <SearchIcon />
            }
            className='ml-2 mt-0 w-48'
          />
        </div>
        <div className='grid grid-cols-2'>
          {
            shared?.map((consult, idx) => {
              return (
                <div className="w-full p-2" key={idx}>
                  <SharedConsult consult={consult} />
                </div>
              )
            })
          }
          {
            shared?.length === 0 ? (<div>아직 공유된 고민이 없습니다</div>) : null
          }
        </div>
      </div>
    </div>
  )
}

export default ConsultShared