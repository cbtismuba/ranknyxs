(() => {
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true
  let acc = 0.2;
  let delayedYOffset = 0;
  let rafId;
  let rafState;

  let currentWidth = window.innerWidth;

  const breakPointForTablet = 1100;
  const breakPointForMobile = 640;

  // Set up Lists for section 5
  const helloList = ["Hello", "你好", "Hola", "こんにちは", "Привет", "Bonjour", "สวัสดี", "Apa kabar", "안녕하세요"];
  const nameList = [
    "Tony",
    "Amanda",
    "Andrew",
    "David",
    "Enrico",
    "Eric",
    "Fitri",
    "Haewon",
    "Hyoungil",
    "Randi",
    "Sergio",
    "Jayden",
    "Jerry",
    "Jun",
    "Khai",
    "Misol",
    "Nicole",
    "Wisnu",
    "Yeha",
    "Yuya",
    "Seba",
  ];

  const sceneInfo = [
    {
      type: "normal", // sticky || normal
      scrollHeight: 0, // 이 후에 기기에 따라서 scrollHeight를 수정해 주기 위해서
      objs: {
        container: document.querySelector("#hero-section"),
        heroOverlay: document.querySelector("#hero-section .hero-section-overlay"),
      },
      values: {
        heroOverlay_background_color_opacity: [0.7, 1, { start: 0.5, end: 0.8 }],
      },
    },
    {
      type: "sticky", // sticky || normal
      heightNum: 10, // 브라우저 높이의 2배로 scrollHeight 세팅
      scrollHeight: 0, // 이 후에 기기에 따라서 scrollHeight를 수정해 주기 위해서
      objs: {
        container: document.querySelector("#scroll-section-1"),
        scrollSection1_overlay: document.querySelector("#scroll-section-1 .scroll-section-1-overlay"),
        scrollSection1_wiseWords: document.querySelector("#scroll-section-1 .wise-words"),

        scrollSection1_launchingDate_p: document.querySelector("#scroll-section-1 .launching-date p"),
        scrollSection1_launchingDate_h1: document.querySelector("#scroll-section-1 .launching-date h1"),

        scrollSection1_nyxs_1_pic: document.querySelector("#scroll-section-1 .nyxs_1 .nyxs_pic div"),
        scrollSection1_nyxs_1_text: document.querySelector("#scroll-section-1 .nyxs_1 .nyxs_text"),

        scrollSection1_nyxs_2_pic: document.querySelector("#scroll-section-1 .nyxs_2 .nyxs_pic div"),
        scrollSection1_nyxs_2_text: document.querySelector("#scroll-section-1 .nyxs_2 .nyxs_text"),

        scrollSection1_nyxs_3_pic: document.querySelector("#scroll-section-1 .nyxs_3 .nyxs_pic div"),
        scrollSection1_nyxs_3_text: document.querySelector("#scroll-section-1 .nyxs_3 .nyxs_text"),

        scrollSection1_nyxs_4_pic: document.querySelector("#scroll-section-1 .nyxs_4 .nyxs_pic div"),
        scrollSection1_nyxs_4_text: document.querySelector("#scroll-section-1 .nyxs_4 .nyxs_text"),
      },
      values: {
        scrollSection1_overlay_opacity: [1, 0, { start: 0.0, end: 0.05 }],
        scrollSection1_wiseWords_opacity_in: [0, 1, { start: 0.0, end: 0.05 }],
        scrollSection1_wiseWords_translateY_in: [20, 0, { start: 0.0, end: 0.05 }],
        scrollSection1_wiseWords_opacity_out: [1, 0, { start: 0.15, end: 0.2 }],
        scrollSection1_wiseWords_translateY_out: [0, -20, { start: 0.15, end: 0.2 }],

        scrollSection1_launchingDate_p_opacity_in: [0, 1, { start: 0.2, end: 0.25 }],
        scrollSection1_launchingDate_p_translateY_in: [20, 0, { start: 0.2, end: 0.25 }],
        scrollSection1_launchingDate_p_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
        scrollSection1_launchingDate_p_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],

        scrollSection1_launchingDate_h1_opacity_in: [0, 1, { start: 0.2, end: 0.25 }],
        scrollSection1_launchingDate_h1_translateY_in: [25, -5, { start: 0.2, end: 0.25 }],

        scrollSection1_launchingDate_h1_translate_effect_scale: [100, 1000, { start: 0.3, end: 0.38 }],
        scrollSection1_launchingDate_h1_opacity_out: [1, 0, { start: 0.35, end: 0.38 }],

        scrollSection1_nyxs_1_pic_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
        scrollSection1_nyxs_1_pic_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],
        scrollSection1_nyxs_1_pic_scaled_out: [1.2, 1.0, { start: 0.4, end: 0.6 }],

        scrollSection1_nyxs_1_text_opacity_in: [0, 1, { start: 0.45, end: 0.5 }],
        scrollSection1_nyxs_1_text_opacity_out: [1, 0, { start: 0.55, end: 0.6 }],
        scrollSection1_nyxs_1_text_translateY: [200, -350, { start: 0.45, end: 0.6 }],

        scrollSection1_nyxs_2_pic_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        scrollSection1_nyxs_2_pic_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        scrollSection1_nyxs_2_pic_scaled_out: [1.2, 1.0, { start: 0.5, end: 0.7 }],

        scrollSection1_nyxs_2_text_opacity_in: [0, 1, { start: 0.55, end: 0.6 }],
        scrollSection1_nyxs_2_text_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        scrollSection1_nyxs_2_text_translateY: [200, -350, { start: 0.55, end: 0.7 }],

        scrollSection1_nyxs_3_pic_opacity_in: [0, 1.0, { start: 0.65, end: 0.75 }],
        scrollSection1_nyxs_3_pic_opacity_out: [1.0, 0, { start: 0.8, end: 0.85 }],
        scrollSection1_nyxs_3_pic_scaled_out: [1.2, 1.0, { start: 0.7, end: 0.85 }],

        scrollSection1_nyxs_3_text_opacity_in: [0, 1, { start: 0.7, end: 0.75 }],
        scrollSection1_nyxs_3_text_opacity_out: [1, 0, { start: 0.8, end: 0.85 }],
        scrollSection1_nyxs_3_text_translateY: [200, -350, { start: 0.7, end: 0.85 }],

        scrollSection1_nyxs_4_pic_opacity_in: [0, 1.0, { start: 0.8, end: 0.9 }],
        scrollSection1_nyxs_4_pic_opacity_out: [1.0, 0, { start: 0.95, end: 1 }],
        scrollSection1_nyxs_4_pic_scaled_out: [1.2, 1.0, { start: 0.8, end: 1 }],

        scrollSection1_nyxs_4_text_opacity_in: [0, 1, { start: 0.85, end: 0.9 }],
        scrollSection1_nyxs_4_text_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        scrollSection1_nyxs_4_text_translateY: [200, -350, { start: 0.85, end: 1 }],
      },
    },
    {
      // Scroll section 2 -> Pick Support Win
      type: "normal", // Sticky | normal
      // heightNum: 5, // 브라우저 높이의 2배로 scrollHeight 세팅
      scrollHeight: 0, // 이 후에 기기에 따라서 scrollHeight를 수정해 주기 위해서
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
      values: {},
    },
    {
      // Scroll section 3 -> how to play
      type: "normal", // Sticky | normal
      scrollHeight: 0, // 이 후에 기기에 따라서 scrollHeight를 수정해 주기 위해서
      objs: {
        container: document.querySelector("#scroll-section-3"),
        scrollSection3_htp_text_1: document.querySelector("#scroll-section-3 .how-to-play #htp-1 .htp-text-1"),
        scrollSection3_htp_pic_1: document.querySelector("#scroll-section-3 .how-to-play #htp-1 .htp-pic-1"),
        scrollSection3_htp_text_2: document.querySelector("#scroll-section-3 .how-to-play #htp-2 .htp-text-2"),
        scrollSection3_htp_pic_2: document.querySelector("#scroll-section-3 .how-to-play #htp-2 .htp-pic-2"),
        scrollSection3_htp_text_3: document.querySelector("#scroll-section-3 .how-to-play #htp-3 .htp-text-3"),
        scrollSection3_htp_pic_3: document.querySelector("#scroll-section-3 .how-to-play #htp-3 .htp-pic-3"),
        scrollSection3_htp_text_4: document.querySelector("#scroll-section-3 .how-to-play #htp-4 .htp-text-4"),
        scrollSection3_htp_pic_4: document.querySelector("#scroll-section-3 .how-to-play #htp-4 .htp-pic-4"),
      },
      values: {
        // // For Scroll -section 2
        scrollSection3_htp_text_1_opacity_in: [0, 1, { start: 0.0, end: 0.1 }],
        scrollSection3_htp_text_1_translateX_in: [-50, 0, { start: 0.0, end: 0.1 }],
        scrollSection3_htp_text_2_opacity_in: [0, 1, { start: 0.2, end: 0.3 }],
        scrollSection3_htp_text_2_translateX_in: [50, 0, { start: 0.2, end: 0.3 }],
        scrollSection3_htp_text_3_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
        scrollSection3_htp_text_3_translateX_in: [-50, 0, { start: 0.4, end: 0.5 }],
        scrollSection3_htp_text_4_opacity_in: [0, 1, { start: 0.6, end: 0.7 }],
        scrollSection3_htp_text_4_translateX_in: [50, 0, { start: 0.6, end: 0.7 }],
      },
    },
    {
      type: "sticky", // Sticky | normal
      heightNum: 1, // 브라우저 높이의 2배로 scrollHeight 세팅
      scrollHeight: 0, // 이 후에 기기에 따라서 scrollHeight를 수정해 주기 위해서
      objs: {
        container: document.querySelector("#scroll-section-4"),
      },
      values: {},
    },
    {
      type: "sticky", // Sticky | normal
      heightNum: 5, // 브라우저 높이의 2배로 scrollHeight 세팅
      scrollHeight: 0, // 이 후에 기기에 따라서 scrollHeight를 수정해 주기 위해서
      objs: {
        container: document.querySelector("#scroll-section-5"),
        scrollSection5_team_intro: document.querySelector("#scroll-section-5 #team-intro"),
        scrollSection5_team_intro_h1: document.querySelector("#scroll-section-5 #team-intro h1"),
        scrollSection5_team_member: document.querySelector("#scroll-section-5 #team-member"),
        scrollSection5_team_member_p: document.querySelector("#scroll-section-5 #team-member .team-photo p"),
        scrollSection5_team_member_div: document.querySelector("#scroll-section-5 #team-member .team-photo div"),
        scrollSection5_team_member_team_txt_h1: document.querySelector("#scroll-section-5 #team-member .team-txt h1"),
      },
      values: {
        scrollSection5_team_intro_h1_index: [0, helloList.length - 1, { start: 0, end: 0.3 }],
        scrollSection5_team_intro_opcity_out: [1, 0, { start: 0.3, end: 0.35 }],
        scrollSection5_team_member_opcity_in: [0, 1, { start: 0.3, end: 0.4 }],
        scrollSection5_team_member_p_index: [0, nameList.length - 1, { start: 0.4, end: 0.8 }],
        scrollSection5_team_member_div_index: [0, nameList.length - 1, { start: 0.4, end: 0.8 }],
        // scrollSection5_team_member_team_txt_h1_index: [0, teamText.length - 1, { start: 0.4, end: 0.8 }],
      },
    },
  ];

  // Add 사전 예약 element
  // function checkMenu() {
  //   if (yOffset > 44) {
  //     document.body.classList.add("local-nav-sticky");
  //   } else {
  //     document.body.classList.remove("local-nav-sticky");
  //   }
  // }

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      // If sticky, assign height set before
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
        // If normal scroll area, assign the height of contents
      } else if (i == 0) {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      } else {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight + window.innerHeight * 0.5;
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        objs.heroOverlay.style.background = `rgba(0, 0, 0, ${calcValues(
          values.heroOverlay_background_color_opacity,
          currentYOffset
        )})`;
        break;
      case 1:
        // Should be between end of starting, and stringing of end
        if (scrollRatio <= 0.22) {
          objs.scrollSection1_overlay.style.opacity = calcValues(values.scrollSection1_overlay_opacity, currentYOffset);
        }

        if (scrollRatio <= 0.1) {
          objs.scrollSection1_wiseWords.style.opacity = calcValues(
            values.scrollSection1_wiseWords_opacity_in,
            currentYOffset
          );
          objs.scrollSection1_wiseWords.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_wiseWords_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else if (scrollRatio <= 0.5) {
          objs.scrollSection1_wiseWords.style.opacity = calcValues(
            values.scrollSection1_wiseWords_opacity_out,
            currentYOffset
          );
          objs.scrollSection1_wiseWords.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_wiseWords_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        // scrollSection1_launchingDate_p
        if (scrollRatio < 0.275) {
          objs.scrollSection1_launchingDate_p.style.opacity = calcValues(
            values.scrollSection1_launchingDate_p_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_launchingDate_p.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_launchingDate_p_translateY_in,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_launchingDate_h1.style.opacity = calcValues(
            values.scrollSection1_launchingDate_h1_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_launchingDate_h1.style.transform = `translate3d(-5%, ${calcValues(
            values.scrollSection1_launchingDate_h1_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else if (scrollRatio < 0.5) {
          objs.scrollSection1_launchingDate_p.style.opacity = calcValues(
            values.scrollSection1_launchingDate_p_opacity_out,
            currentYOffset
          );
          objs.scrollSection1_launchingDate_p.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_launchingDate_p_translateY_out,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_launchingDate_h1.style.opacity = calcValues(
            values.scrollSection1_launchingDate_h1_opacity_out,
            currentYOffset
          );

          objs.scrollSection1_launchingDate_h1.style.transform = `scale(${calcValues(
            values.scrollSection1_launchingDate_h1_translate_effect_scale,
            currentYOffset
          )}%) translate3d(-5%, -5%, 0)`;
        }
        //* Section 2 - 1
        if (scrollRatio >= 0.4) {
          objs.scrollSection1_nyxs_1_pic.style.opacity = calcValues(
            values.scrollSection1_nyxs_1_pic_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_nyxs_1_text.style.opacity = calcValues(
            values.scrollSection1_nyxs_1_text_opacity_in,
            currentYOffset
          );
          objs.scrollSection1_nyxs_1_text.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_nyxs_1_text_translateY,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_nyxs_1_pic.style.transform = `scale(${calcValues(
            values.scrollSection1_nyxs_1_pic_scaled_out,
            currentYOffset
          )})`;
        } else if (scrollRatio >= 0.55) {
          objs.scrollSection1_nyxs_1_pic.style.opacity = calcValues(
            values.scrollSection1_nyxs_1_pic_opacity_out,
            currentYOffset
          );

          objs.scrollSection1_nyxs_1_text.style.opacity = calcValues(
            values.scrollSection1_nyxs_1_text_opacity_out,
            currentYOffset
          );
          objs.scrollSection1_nyxs_1_text.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_nyxs_1_text_translateY,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_nyxs_1_pic.style.transform = `scale(${calcValues(
            values.scrollSection1_nyxs_1_pic_scaled_out,
            currentYOffset
          )})`;
        } else {
          objs.scrollSection1_nyxs_1_pic.style.opacity = 0;
          objs.scrollSection1_nyxs_1_text.style.opacity = 0;
        }
        //* Section 2 - 2
        if (scrollRatio >= 0.5) {
          objs.scrollSection1_nyxs_2_pic.style.opacity = calcValues(
            values.scrollSection1_nyxs_2_pic_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_nyxs_2_text.style.opacity = calcValues(
            values.scrollSection1_nyxs_2_text_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_nyxs_2_text.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_nyxs_2_text_translateY,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_nyxs_2_pic.style.transform = `scale(${calcValues(
            values.scrollSection1_nyxs_2_pic_scaled_out,
            currentYOffset
          )})`;
        } else if (scrollRatio >= 0.625) {
          objs.scrollSection1_nyxs_2_pic.style.opacity = calcValues(
            values.scrollSection1_nyxs_2_pic_opacity_out,
            currentYOffset
          );

          objs.scrollSection1_nyxs_2_text.style.opacity = calcValues(
            values.scrollSection1_nyxs_2_text_opacity_out,
            currentYOffset
          );

          objs.scrollSection1_nyxs_2_text.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_nyxs_2_text_translateY,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_nyxs_2_pic.style.transform = `scale(${calcValues(
            values.scrollSection1_nyxs_2_pic_scaled_out,
            currentYOffset
          )})`;
        } else {
          objs.scrollSection1_nyxs_2_pic.style.opacity = 0;
          objs.scrollSection1_nyxs_2_text.style.opacity = 0;
        }
        //* Section 2-3
        if (scrollRatio >= 0.65) {
          objs.scrollSection1_nyxs_3_pic.style.opacity = calcValues(
            values.scrollSection1_nyxs_3_pic_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_nyxs_3_text.style.opacity = calcValues(
            values.scrollSection1_nyxs_3_text_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_nyxs_3_text.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_nyxs_3_text_translateY,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_nyxs_3_pic.style.transform = `scale(${calcValues(
            values.scrollSection1_nyxs_3_pic_scaled_out,
            currentYOffset
          )})`;
        } else if (scrollRatio >= 0.775) {
          objs.scrollSection1_nyxs_3_pic.style.opacity = calcValues(
            values.scrollSection1_nyxs_3_pic_opacity_out,
            currentYOffset
          );

          objs.scrollSection1_nyxs_3_text.style.opacity = calcValues(
            values.scrollSection1_nyxs_3_text_opacity_out,
            currentYOffset
          );

          objs.scrollSection1_nyxs_3_text.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_nyxs_3_text_translateY,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_nyxs_3_pic.style.transform = `scale(${calcValues(
            values.scrollSection1_nyxs_3_pic_scaled_out,
            currentYOffset
          )})`;
        } else {
          objs.scrollSection1_nyxs_3_pic.style.opacity = 0;
          objs.scrollSection1_nyxs_3_text.style.opacity = 0;
        }
        //* Section 2-4

        if (scrollRatio >= 0.8) {
          objs.scrollSection1_nyxs_4_pic.style.opacity = calcValues(
            values.scrollSection1_nyxs_4_pic_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_nyxs_4_text.style.opacity = calcValues(
            values.scrollSection1_nyxs_4_text_opacity_in,
            currentYOffset
          );

          objs.scrollSection1_nyxs_4_text.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_nyxs_4_text_translateY,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_nyxs_4_pic.style.transform = `scale(${calcValues(
            values.scrollSection1_nyxs_4_pic_scaled_out,
            currentYOffset
          )})`;
        } else if (scrollRatio >= 0.925) {
          objs.scrollSection1_nyxs_4_pic.style.opacity = calcValues(
            values.scrollSection1_nyxs_4_pic_opacity_out,
            currentYOffset
          );

          objs.scrollSection1_nyxs_4_text.style.opacity = calcValues(
            values.scrollSection1_nyxs_4_text_opacity_out,
            currentYOffset
          );

          objs.scrollSection1_nyxs_4_text.style.transform = `translate3d(0, ${calcValues(
            values.scrollSection1_nyxs_4_text_translateY,
            currentYOffset
          )}%, 0)`;

          objs.scrollSection1_nyxs_4_pic.style.transform = `scale(${calcValues(
            values.scrollSection1_nyxs_4_pic_scaled_out,
            currentYOffset
          )})`;
        } else {
          objs.scrollSection1_nyxs_4_pic.style.opacity = 0;
          objs.scrollSection1_nyxs_4_text.style.opacity = 0;
        }

        break;
      case 2:
        break;
      case 3:
        if (scrollRatio <= 0.1) {
          objs.scrollSection3_htp_text_1.style.opacity = calcValues(
            values.scrollSection3_htp_text_1_opacity_in,
            currentYOffset
          );
          objs.scrollSection3_htp_text_1.style.transform = `translate3d(
            ${calcValues(values.scrollSection3_htp_text_1_translateX_in, currentYOffset)}%, 0, 0)`;
        } else if (scrollRatio <= 0.3) {
          objs.scrollSection3_htp_text_1.style.opacity = 1;
          objs.scrollSection3_htp_text_1.style.transform = "translate3d(0, 0, 0)";
          objs.scrollSection3_htp_text_2.style.opacity = calcValues(
            values.scrollSection3_htp_text_2_opacity_in,
            currentYOffset
          );
          objs.scrollSection3_htp_text_2.style.transform = `translate3d(
            ${calcValues(values.scrollSection3_htp_text_2_translateX_in, currentYOffset)}%, 0, 0)`;
        } else if (scrollRatio <= 0.5) {
          objs.scrollSection3_htp_text_2.style.opacity = 1;
          objs.scrollSection3_htp_text_2.style.transform = "translate3d(0, 0, 0)";
          objs.scrollSection3_htp_text_3.style.opacity = calcValues(
            values.scrollSection3_htp_text_3_opacity_in,
            currentYOffset
          );
          objs.scrollSection3_htp_text_3.style.transform = `translate3d(
            ${calcValues(values.scrollSection3_htp_text_3_translateX_in, currentYOffset)}%, 0, 0)`;
        } else if (scrollRatio <= 0.7) {
          objs.scrollSection3_htp_text_3.style.opacity = 1;
          objs.scrollSection3_htp_text_3.style.transform = "translate3d(0, 0, 0)";
          objs.scrollSection3_htp_text_4.style.opacity = calcValues(
            values.scrollSection3_htp_text_4_opacity_in,
            currentYOffset
          );
          objs.scrollSection3_htp_text_4.style.transform = `translate3d(
            ${calcValues(values.scrollSection3_htp_text_4_translateX_in, currentYOffset)}%, 0, 0)`;
        } else {
          objs.scrollSection3_htp_text_4.style.opacity = 1;
          objs.scrollSection3_htp_text_4.style.transform = "translate3d(0, 0, 0)";
        }
        break;
      case 4:
        break;
      case 5:
        objs.scrollSection5_team_intro_h1.innerHTML =
          helloList[parseInt(calcValues(values.scrollSection5_team_intro_h1_index, currentYOffset))];

        objs.scrollSection5_team_intro.style.opacity = calcValues(
          values.scrollSection5_team_intro_opcity_out,
          currentYOffset
        );
        objs.scrollSection5_team_member.style.opacity = calcValues(
          values.scrollSection5_team_member_opcity_in,
          currentYOffset
        );

        objs.scrollSection5_team_member_div.style.backgroundImage = `url('images/pictures/${
          nameList[parseInt(calcValues(values.scrollSection5_team_member_div_index, currentYOffset))]
        }.jpg')`;

        objs.scrollSection5_team_member_p.innerHTML = `NYXS team<br>@${
          nameList[parseInt(calcValues(values.scrollSection5_team_member_p_index, currentYOffset))]
        }`;

        // objs.scrollSection5_team_member_team_txt_h1.innerHTML =
        //   teamText[parseInt(calcValues(values.scrollSection5_team_member_team_txt_h1_index, currentYOffset))];

        objs.scrollSection5_team_member.style.opacity = calcValues(
          values.scrollSection5_team_member_opcity_in,
          currentYOffset
        );

        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true;
      // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      if (currentScene == 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
  }

  function loop() {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
    if (delayedYOffset < 1) {
      scrollLoop();
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  window.addEventListener("load", () => {
    setLayout();
    // 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
    let tempYOffset = yOffset;
    let tempScrollCount = 0;
    if (tempYOffset > 0) {
      let siId = setInterval(() => {
        scrollTo(0, tempYOffset);
        tempYOffset += 5;

        if (tempScrollCount > 20) {
          clearInterval(siId);
        }
        tempScrollCount++;
      }, 20);
    }

    window.addEventListener("scroll", () => {
      yOffset = window.pageYOffset;
      scrollLoop();
      // checkMenu();

      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });

    window.addEventListener("resize", () => {
      const resizedWidth = window.innerWidth;
      if (window.innerWidth != currentWidth) {
        if (window.innerWidth < breakPointForTablet) {
          window.location.reload();
        } else {
          if (window.innerWidth < breakPointForMobile) {
            window.location.reload();
          }
        }
        currentWidth = resizedWidth;
      }
    });

    // Set evemt listener for resize orientation change
    window.addEventListener("orientationchange", () => {
      scrollTo(0, 0);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  });
  setLayout();
})();

const forwardToPlaystore = () => {
  window.location = "https://play.google.com/store/apps/details?id=com.nyxs.star";
};

const forwardToAppStore = () => {
  window.location = "https://apps.apple.com/app/id6444117546";
};

function detectAndServe() {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    forwardToAppStore();
  } else {
    forwardToPlaystore();
  }
}
