'use client'

import { Bookmark, IosShare, Send } from "@mui/icons-material";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Home() {

  const { ref, inView } = useInView();
  const [isOpen, setIsOpen] = useState(null);

  const getTodos = async ({ pageParam }) => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/photos?_page=${pageParam}&_limit=30`);
    return response.data;
  };

  const { data: todoList, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage?.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <main className="container mx-auto">
      <div className="p-5">
        <p className='mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white text-center'>U-News</p>
        {
          todoList?.pages?.map((todo, index) => {
            return (
              todo?.map((item, i) => {
                return (
                  <div key={i} ref={ref} className="border border-zinc-500 mb-3 rounded-md relative overflow-hidden">
                    <div className="p-3 w-full mx-auto md:flex md:items-center md:gap-4">
                      <Image src={item?.url} alt="" priority height={0} width={0} className="w-full h-[305px] object-cover mb-4 rounded-md md:mb-0" sizes='100vw' onClick={() => setIsOpen(isOpen == item?.id ? null : item?.id)}/>
                      <div className="md:flex md:flex-col md:justify-between md:h-[305px]">
                        <div>
                          <h1 className='text-wrap text-2xl mb-4' style={{ textDecoration: item?.completed && 'line-through', color: item?.completed && '#5f5f5f' }}>{`${item.title}`}</h1>
                          <p className="text-[.9rem] font-light text-[#dadada] opacity-90 mb-3" onClick={() => setIsOpen(isOpen == item?.id ? null : item?.id)}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem.</p>
                        </div>
                        <a className="text- pb-4 text-blue-500" href="https://youtube.com" target="_blank">Read More At News18.in</a>
                      </div>
                    </div>
                    <div className="h-[55px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-b-[0.375rem] md:hidden">
                      <div className="flex h-full flex-col items-start justify-around px-2">
                        <p className="text-[16px]">1st ever auction took place on Feb 20, 2008</p>
                        <a className="text-[14px]">Tap To Read More</a>
                      </div>
                    </div>
                    <div className="h-[55px] bg-gradient-to-r from-red-500 to-orange-500 rounded-b-[0.375rem] md:hidden absolute right-0 w-full" style={{ bottom: isOpen == item?.id ? '0px' : '-55px', transition: 'all 0.3s ease-in-out' }}>
                      <div className="flex h-full items-center justify-evenly">
                        <div className="text-center">
                          <IosShare />
                          <p>Share</p>
                        </div>
                        <div className="text-center">
                          <Bookmark />
                          <p>Bookmark</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )
          })
        }
        {isFetchingNextPage &&
          <div className="w-full mx-auto text-center flex item-center justify-center">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          </div>
        }
      </div>
    </main>
  )
}
