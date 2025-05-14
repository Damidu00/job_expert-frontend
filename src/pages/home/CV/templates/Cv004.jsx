import React from "react";

const CV = () => {
  return (
    <div className="cv5-container flex max-w-[900px] bg-[#eaeaea] justify-between mx-auto my-5 shadow-[1px_1px_10px_rgba(0,0,0,0.1)]">
      <div className="cv5-profile flex-basis-[35%] bg-[#39383a] text-[#ababab] flex flex-col items-center pt-[40px]">
        <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white mb-[5px]">
          <div className="w-full h-full  bg-[url('https://pp.userapi.com/c851228/v851228813/91525/WJp3jHoX0Zs.jpg')] bg-cover bg-center"></div>
        </div>
        <div className="cv5-profile-info px-[30px] pt-[50px] pb-[70px] ">
          <h2 className="cv5-heading cv5-heading-light mb-[16px] uppercase font-bold">
            Profile
          </h2>
          <p className="cv5-profile-text text-[13px] leading-[24.19px] mb-[10px]">
            Hello! I’m Robert Smith. Senior Web Developer specializing in front
            end development. Experienced with all stages of the development
            cycle for dynamic web projects. Well-versed in numerous programming
            languages including JavaScript, SQL, and C. Strong background in
            project management and customer relations.
          </p>

          <div className="cv5-contacts mb-[10px]">
            <div className="cv5-contacts-item py-[24px] border-b-2 border-[#5a5a5a]">
              <h3 className="cv5-contacts-title text-[#fff] mb-[13px] text-[16px] font-normal">
                <i className="fas fa-phone-volume mr-[7px]"></i>
                Phone
              </h3>
              <a
                href="tel:+18001234567"
                className="cv5-contacts-text text-[#ababab] pl-[27px] leading-[20.97px]"
              >
                +(1800) 123 4567
              </a>
            </div>
            <div className="cv5-contacts-item py-[24px] border-b-2 border-[#5a5a5a]">
              <h3 className="cv5-contacts-title text-[#fff] mb-[13px] text-[16px] font-normal">
                <i className="fas fa-envelope mr-[7px]"></i>
                Email
              </h3>
              <a
                href="mailto:Robertsmith@gmail.com"
                className="cv5-contacts-text text-[#ababab] pl-[27px] leading-[20.97px]"
              >
                Robertsmith@gmail.com
              </a>
            </div>
            <div className="cv5-contacts-item py-[24px] border-b-2 border-[#5a5a5a]">
              <h3 className="cv5-contacts-title text-[#fff] mb-[13px] text-[16px] font-normal">
                <i className="fas fa-globe-americas mr-[7px]"></i>
                Web
              </h3>
              <a
                href="http://www.robertsmith.com"
                className="cv5-contacts-text text-[#ababab] pl-[27px] leading-[20.97px]"
              >
                www.robertsmith.com
              </a>
            </div>
            <div className="cv5-contacts-item py-[24px] border-b-2 border-[#5a5a5a]">
              <h3 className="cv5-contacts-title text-[#fff] mb-[13px] text-[16px] font-normal">
                <i className="fas fa-map-marker-alt mr-[7px]"></i>
                Home
              </h3>
              <address className="cv5-contacts-text text-[#ababab] pl-[27px] leading-[20.97px]">
                24058, Belgium, Brussels, <br />
                Liutte 27, BE
              </address>
            </div>
          </div>

          <h2 className="cv5-heading cv5-heading-light mb-[16px] uppercase font-bold">
            Languages
          </h2>
          <div className="cv5-languages flex flex-wrap pt-[40px]">
            <div className="cv5-language w-[100px] h-[100px] border-6 border-[#5c5c5c] rounded-full flex justify-center items-center flex-col mb-[30px] mr-[30px]">
              <span className="cv5-language-text uppercase text-[11px]">
                English
              </span>
              <strong className="cv5-languages-per text-[15px] font-semibold">
                100%
              </strong>
            </div>
            <div class="cv5-language w-[100px] h-[100px] border-6 border-[#5c5c5c] rounded-full flex justify-center items-center flex-col mb-[30px] mr-[30px]">
              <span className="cv5-language-text uppercase text-[11px]">
                French
              </span>
              <strong className="cv5-languages-per text-[15px] font-semibold">
                90%
              </strong>
            </div>
            <div className="cv5-language w-[100px] h-[100px] border-6 border-[#5c5c5c] rounded-full flex justify-center items-center flex-col mb-[30px]">
              <span className="cv5-language-text uppercase text-[11px]">
                Greek
              </span>
              <strong className="cv5-languages-per text-[15px] font-semibold">
                80%
              </strong>
            </div>
            <div className="cv5-lines flex flex-col justify-center">
              <span className="cv5-line block w-[90px] h-[2px] bg-[#5c5c5c] my-[10px]"></span>
              <span className="cv5-line block w-[100px] h-[2px] bg-[#5c5c5c] my-[10px] ml-[20px]"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="cv5-resume p-[25px] flex-basis-[63%] bg-[#fff]">
        <div className="cv5-resume-wrap p-[36px] border border-[#a8a8a8] opacity-40 min-h-full">
          <div className="cv5-logo flex justify-center mb-[38px]">
            <div className="cv5-logo-lines cv5-logo-lines_left flex flex-col items-center">
              <span className="cv5-logo-line w-[43px] h-[2px] bg-[#39383a] my-[10px]"></span>
              <span className="cv5-logo-line w-[43px] h-[2px] bg-[#39383a] my-[10px]"></span>
              <span className="cv5-logo-line w-[43px] h-[2px] bg-[#39383a] my-[10px]"></span>
            </div>
            <div className="cv5-logo-img w-[90px] h-[90px] border border-[#39383a] rounded-full flex justify-center items-center">
              R/S
            </div>
            <div className="cv5-logo-lines cv5-logo-lines_right flex flex-col items-center">
              <span className="cv5-logo-line w-[43px] h-[2px] bg-[#39383a] my-[10px]"></span>
              <span className="cv5-logo-line w-[43px] h-[2px] bg-[#39383a] my-[10px]"></span>
              <span className="cv5-logo-line w-[43px] h-[2px] bg-[#39383a] my-[10px]"></span>
            </div>
          </div>

          <div className="cv5-about text-center mb-[40px] border-b border-[#e0e0e0] pb-[30px]">
            <h1 className="cv5-name text-[16px] uppercase tracking-[10.75px] mb-[10px]">
              Robert Smith
            </h1>
            <span className="cv5-position text-[9px] uppercase text-[#808080] mb-[30px]">
              Web Developer / Designer
            </span>
            <address className="cv5-about-address text-[13px] mb-[15px]">
              123 Street, 24058, Belgium, Brussels, Liutte 27, BE
            </address>
            <div className="cv5-about-contacts text-[8px]">
              <a
                className="cv5-about-contacts__link text-[#777777] no-underline"
                href="#"
              >
                <b>t</b>: (1800) 123 45678
              </a>{" "}
              |
              <a
                className="cv5-about-contacts__link text-[#777777] no-underline"
                href="#"
              >
                <b>e</b>: Robertsmith@gmail.com
              </a>{" "}
              |
              <a
                className="cv5-about-contacts__link text-[#777777] no-underline"
                href="#"
              >
                <b>w</b>: www.robertsmith.com
              </a>
            </div>
          </div>

          <div className="cv5-experience">
            <h2 className="cv5-heading cv5-heading_dark mb-[37px]">
              Experience
            </h2>
          </div>

          <div className="cv5-education">
            <h2 className="cv5-heading cv5-heading_dark mb-[37px]">
              Education
            </h2>
            <ul className="cv5-list list-none pl-0">
              <li className="cv5-list-item list-item_non-border relative pb-[30px] mb-[30px]">
                <h4 className="cv5-list-item__title text-[11px] uppercase mb-[5px]">
                  Hexogan Web Development Company
                </h4>
                <span className="cv5-list-item__date text-[10px] uppercase">
                  Jan 2016 - Oct 2016
                </span>
                <p className="cv5-list-item__text text-[10px] text-[#777]">
                  Fleeing from the Cylon tyranny the last Battlestar – Galactica
                  - leads a rag-tag fugitive fleet on a lonely quest - a shining
                  planet known as Earth? Texas tea.
                </p>
              </li>
            </ul>
          </div>

          <div className="cv5-skills">
            <h2 className="cv5-heading cv5-heading_dark cv5-heading_skills mb-[48px]">
              Skills
            </h2>
            <ul className="cv5-skills-list list-none pl-0">
              <li className="cv5-skills-list__item text-[11px] uppercase flex justify-between mb-[30px]">
                Wordpress
                <div className="cv5-level w-[70%] h-[8px] border border-[#39383a] relative">
                  <div className="cv5-level:before absolute top-0 left-0 h-full bg-[#898989] w-[80%]"></div>
                </div>
              </li>
              <li className="cv5-skills-list__item text-[11px] uppercase flex justify-between mb-[30px]">
                HTML
                <div className="cv5-level w-[70%] h-[8px] border border-[#39383a] relative">
                  <div className="cv5-level:before absolute top-0 left-0 h-full bg-[#898989] w-[90%]"></div>
                </div>
              </li>
              <li className="cv5-skills-list__item text-[11px] uppercase flex justify-between mb-[30px]">
                Photoshop
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CV;
