window.addEventListener("DOMContentLoaded", () => {
  commonInit();
});
window.addEventListener("load", () => {
  layoutFunc();
});

$(function() {
  reformFunc();
});

function layoutFunc(){
  let header_section = document.querySelector(".header_section");
  let page_wrap = document.querySelector(".page_wrap");

  action();
  mbTotal();
  window.addEventListener("resize",()=>{
    action();
  });

  function action(){
    if(!header_section){return;}
    page_wrap.style.removeProperty("min-height");
    page_wrap.style.paddingTop = header_section.getBoundingClientRect().height + "px";
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
        setTimeout(function() {
          if(!!mobile_mainmenu_wrap){
            setTabControl(".mobile_mainmenu_wrap");
          }
        },500);
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


function menuRock(item){
  $(function(){
    if(!!item){
      $(item).addClass("active");
    }
  });
}



/* popup */
class DesignPopup {
  constructor (option){
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
              },false);
          });
      }
  }
  dimCheck(){
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
  popupShow(){
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      if (this.selector == null) { return; }
      if(this.touchstart){
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
  popupHide(){
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


function reformFunc(){
	var $resitem = $("[data-pcwid]");
	var $resitem2 = $("[data-pcflex]");
	$(window).on("resize",function(){
		$resitem.each(function(){
			if($(window).width()<=767){
				$(this).css({"width":""});
			}else{
				$(this).css({ "width": $(this).attr("data-pcwid")});
			}
		});
		$resitem2.each(function(){
			if($(window).width()<=767){
				$(this).css({"flex-basis":""});
			}else{
				$(this).css({ "flex-basis": $(this).attr("data-pcflex")});
			}
		});
	}).resize();
}

