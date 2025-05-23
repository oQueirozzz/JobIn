'use client';

import {usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  if (pathname === '') {
    return null;
  }
    return (
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-wine-500 font-bold text-2xl mr-1">
                  Job
                </span>
                <span className="bg-wine-500 text-white text-xl font-bold px-2 py-0.5 rounded">
                  In
                </span>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-wine-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <i className="mr-2" data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-house"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="house"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                        ></path>
                      </svg>
                    </i>
                    In cio
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-wine-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <i className="mr-2" data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-briefcase"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="briefcase"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z"
                        ></path>
                      </svg>
                    </i>
                    Vagas
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-wine-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <i className="mr-2" data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-building"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="building"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16z"
                        ></path>
                      </svg>
                    </i>
                    Empresas
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-wine-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <i className="mr-2" data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-calendar-days"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="calendar-days"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16z"
                        ></path>
                      </svg>
                    </i>
                    Eventos
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="bg-beige-100 px-4 py-2 pl-10 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-wine-500"
                  />
                  <i className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-magnifying-glass"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="magnifying-glass"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                      ></path>
                    </svg>
                  </i>
                </div>
                <span className="text-gray-700 hover:text-wine-500 cursor-pointer">
                  <i className="text-xl" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-bell"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="bell"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3c12.9 12.9 32.7 12.9 45.7 0l6.6-6.6c.5-.5 1.2-1 1.8-1.5s1.3-.7 1.8-1.2l6.6-6.6c9.1-9.1 24.3-9.1 33.3 0s9.1 24.3 0 33.3L269.3 493.3z"
                      ></path>
                    </svg>
                  </i>
                </span>
                <span className="text-gray-700 hover:text-wine-500 cursor-pointer">
                  <i className="text-xl" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-user"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="user"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                      ></path>
                    </svg>
                  </i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }




