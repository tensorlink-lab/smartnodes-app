const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading:
    "font-poppins font-bold text-[26px] xs:text-[34px] sm:text-[44px] lg:text-[50px] text-gray-700 dark:text-white w-full ",
  heading2:
    "font-poppins font-bold text-[30px] xs:text-[38px] sm:text-[50px] lg:text-[50px] text-gray-700 dark:text-white w-full ",
  subheading:
    "font-poppins font-bold text-[24px] xs:text-[30px] md:text-[40px] lg:text-[45px] text-gray-700 dark:text-white w-full ",
  subheading2:
    "font-poppins font-bold text-[18px] xs:text-[24px] sm:text-[28px] lg:text-[32px] text-gray-700 dark:text-white w-full ",
  subheading3:
    "font-poppins font-bold text-[16px] xs:text-[22px] lg:text-[26px] text-gray-700 dark:text-white w-full ",
  paragraph:
    "font-poppins font-normal dark:text-white text-gray-900 sm:text-[16px] md:text-[18px] leading-[30.8px]",

  content: "flex flex-col max-w-[1440px] px-5 md:px-10 lg:px-20",
  contentBox: "flex items-center bg-primary border-radius-50",
  textBubble: "dark:bg-gray-900 bg-gray-200 rounded-3xl px-10 py-1",

  flexCenter: "flex items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-8",
  paddingY: "sm:py-16 py-5",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",

  section:
    "sm:mt-10 px-2 md:px-5 flex md:flex-row flex-col items-center justify-center py-3",
  section2:
    "sm:py-16 py-15 px-10 flex md:flex-row flex-col items-center justify-center bg-black-gradient rounded-xl z-0 max-w-[1250px] mx-auto",
  animatedIcon: "flex h-full w-full hidden xs:block block",
  landingText:
    "text-[16px] md:text-[20px] lg:text-[22px] text-black dark:text-white leading-8",
  landingText2:
    "text-[14px] md:text-[18px] lg:text-[20px] text-black dark:text-white leading-8",
};

export const layout = {
  section: `flex md:flex-row flex-col ${styles.paddingY} items-center justify-center pb-10`,
  sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

  sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
  sectionImg: `flex-1 flex ${styles.Start} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

  sectionInfo: `flex-1 ${styles.flexStart} flex-col align-items-center`,
  features: `flex flex-row justify-around w-full mt-10`,
  feature: `flex-col justify-center items-center text-center max-w-[400px]`,
};

export default styles;
