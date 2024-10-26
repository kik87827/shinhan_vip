window.addEventListener("DOMContentLoaded", () => {
  commonInit();
  layoutFunc();
  // 최초 로드 시 호출
  setVhProperty();
  // 창 크기가 변경될 때마다 호출
  window.addEventListener('resize', setVhProperty);
});
window.addEventListener("load", () => {
});

function setVhProperty() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}


$(function () {
  //reformFunc();
});

function layoutFunc() {
  const header_section = document.querySelector(".header_section");
  const page_wrap = document.querySelector(".page_wrap");

  action();
  resizeAction(()=>{
    action();
  });


  mbTotal();
  function action(){
    if(!header_section){return;}
    page_wrap.removeAttribute("style");
    page_wrap.style.paddingTop = header_section.getBoundingClientRect().height + "px";
    let headerHeight = header_section.getBoundingClientRect().height;
    page_wrap.setAttribute("style",`padding-top: ${headerHeight}px`)
  }
  function mbTotal() {
    var touchstart = "ontouchstart" in window;
    var btn_panel_menu = document.querySelector(".btn_panel_menu"),
      mobile_panel_zone = document.querySelector(".mobile_panel_zone"),
      mobile_panel_dim = document.querySelector(".mobile_panel_dim"),
      btn_mbmenuclose = document.querySelector(".btn_mbmenuclose"),
      mobile_mainmenu_wrap = document.querySelector(".mobile_mainmenu_wrap");
      domHtml = document.querySelector("html"),
      domBody = document.querySelector("body");

    // init 
    if (mobile_panel_zone === null) {
      return;
    }
    btn_panel_menu.addEventListener("click", function(e) {
      e.preventDefault();
      totalOpen();
    }, false);
    btn_mbmenuclose.addEventListener("click", function(e) {
      e.preventDefault();
      totalClose();
    }, false);
    mobile_panel_dim.addEventListener("click", function(e) {
      e.preventDefault();
      totalClose();
    }, false);
    resizeAction(()=>{
      if(window.innerWidth > 767){
        totalClose();
      }
    });

    function totalOpen() {
      mobile_panel_zone.classList.add("active")
      setTimeout(function() {
        mobile_panel_zone.classList.add("motion");
        if (touchstart) {
          domHtml.classList.add("touchDis");
        }
      }, 30);
    }

    function totalClose() {
      mobile_panel_zone.classList.remove("motion");
      setTimeout(function() {
        mobile_panel_zone.classList.remove("active");
        domHtml.classList.remove("touchDis");
      }, 500);
    }
  }
}

/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf("samsung") > -1) {
    browserAdd("samsung");
  }

  if (
    navigator.platform.indexOf("Win") > -1 ||
    navigator.platform.indexOf("win") > -1
  ) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }

  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/*
  resize
*/
function resizeAction(callback) {
  let windowWid = 0;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== windowWid) {
      if (callback) {
        callback();
      }
    }
    windowWid = window.innerWidth;
  });
}


function menuRock(item) {
  $(function () {
    if (!!item) {
      $(item).addClass("active");
    }
  });
}



/* popup */
class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.touchstart = "ontouchstart" in window;
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");


    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          this.popupHide(this.selector);
        }, false);
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow() {
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) { return; }
    if (this.touchstart) {
      this.domHtml.classList.add("touchDis");
    }
    this.selector.classList.add("active");
    setTimeout(() => {
      this.selector.classList.add("motion_end");
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    /* if (!!this.design_popup_wrap_active) {
      this.design_popup_wrap_active.forEach((element, index) => {
          if (this.design_popup_wrap_active !== this.selector) {
              element.classList.remove("active");
          }
      });
    } */
    this.layer_wrap_parent.append(this.selector);
    this.dimCheck();
  }
  popupHide() {
    let target = this.option.selector;
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      setTimeout(() => {
        this.selector.classList.remove("active");
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();
      if ("closeCallback" in this.option) {
        this.option.closeCallback();
      }
      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}


function designModal(option) {
  const modalGroupCreate = document.createElement("div");
  let domHtml = document.querySelector("html");
  let design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
  let modal_wrap_parent = null;
  let modal_item = null;
  let pagewrap = document.querySelector(".page_wrap");
  let showNum = 0;
  let okTextNode = option.okText ?? '확인';
  let cancelTextNode = option.cancelText ?? '취소';
  modalGroupCreate.classList.add("modal_wrap_parent");

  if (!modal_wrap_parent && !document.querySelector(".modal_wrap_parent")) {
    pagewrap.append(modalGroupCreate);
  } else {
    modalGroupCreate.remove();
  }
  modal_wrap_parent = document.querySelector(".modal_wrap_parent");

  let btnHTML = ``;

  if (option.modaltype === "confirm") {
    btnHTML = `
    <a href="#" class="btn_modal_submit primary okcall"><span class="btn_modal_submit_text">${okTextNode}</span></a>
      <a href="#" class="btn_modal_submit cancelcall"><span class="btn_modal_submit_text">${cancelTextNode}</span></a>
    `;
  } else {
    btnHTML = `
      <a href="#" class="btn_modal_submit primary okcall"><span class="btn_modal_submit_text">${okTextNode}</span></a>
    `;
  }
  

  let modal_template = `
    <div class="modal_wrap">
        <div class="bg_dim"></div>
        <div class="modal_box_tb">
            <div class="modal_box_td">
                <div class="modal_box_item">
                    <div class="modal_box_message_row">
                        <p class="modal_box_message">${option.message}</p>
                    </div>
                    <div class="btn_modal_submit_wrap">
                        ${btnHTML}
                    </div>
                    <a href="javascript:;" class="btn_modal_close"><span class="hdtext">모달 닫기</span></a>
                </div>
            </div>
        </div>
    </div>
  `;
  modal_wrap_parent.innerHTML = modal_template;
  modal_item = modal_wrap_parent.querySelector(".modal_wrap");
  modal_item.classList.add("active");
  if (showNum) { clearTimeout(showNum); }
  showNum = setTimeout(() => {
    modal_item.classList.add("motion_end");
    modal_item.addEventListener("transitionend", (e) => {
      if (e.currentTarget.classList.contains("motion_end")) {
        if (option.showCallback) {
          option.showCallback();
        }
      }
    });
  }, 10);

  let btn_modal_submit = modal_item.querySelectorAll(".btn_modal_submit");
  let btn_modal_close = modal_item.querySelectorAll(".btn_modal_close");
  if (!!btn_modal_submit) {
    btn_modal_submit.forEach((item) => {
      let eventIs = false;
      if (eventIs) {
        item.removeEventListener("click");
      }
      item.addEventListener("click", (e) => {
        let thisTarget = e.currentTarget;
        closeAction();
        if (thisTarget.classList.contains("okcall")) {
          if (option.okcallback) {
            option.okcallback();
          }
        } else if (thisTarget.classList.contains("cancelcall")) {
          if (option.cancelcallback) {
            option.cancelcallback();
          }
        }
        eventIs = true;
      });
    });
  }
  if(!!btn_modal_close){
    console.log(btn_modal_close);
    btn_modal_close.forEach((item)=>{
      let eventIs = false;
      if (eventIs) {
        item.removeEventListener("click");
      }
      item.addEventListener("click", (e) => {
        closeAction();
        eventIs = true;
      });
    })
  }

  function closeAction() {
    let actionNum = 0;
    modal_item.classList.remove("motion_end");
    if (design_popup_wrap_active.length === 0) {
      domHtml.classList.remove("touchDis");
    }
    if (actionNum) { clearTimeout(actionNum); }
    actionNum = setTimeout(() => {
      modal_item.classList.remove("active");
      modal_item.remove();
    }, 500);
  }
}
