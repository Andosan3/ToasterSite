//nav menu text
let splitType = new SplitType("[hoverstagger='text']", {
  types: "words,chars",
  tagName: "span"
});

$("[hoverstagger='link']").each(function (index) {
  let text1 = $(this).find("[hoverstagger='text']").eq(0);
  let text2 = $(this).find("[hoverstagger='text']").eq(1);

  let tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.5,
      ease: "power2.out"
    }
  });
  tl.fromTo(text1.find(".char:nth-child(odd)"), { yPercent: 100 }, { yPercent: 0 });
  tl.fromTo(text2.find(".char:nth-child(odd)"), { yPercent: 0 }, { yPercent: -100 }, 0);
  tl.fromTo(text1.find(".char:nth-child(even)"), { yPercent: 0 }, { yPercent: 100 }, 0);
  tl.fromTo(text2.find(".char:nth-child(even)"), { yPercent: -100 }, { yPercent: 0 }, 0);

  $(this).on("mouseenter", function () {
    tl.restart();
  });
});





//TEXT STAGGERS

window.addEventListener("DOMContentLoaded", (event) => {
  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span"
  });

  // Link timelines to scroll position
  function createScrollTrigger(triggerElement, timeline) {
    // Reset tl when scroll out of view past bottom of screen
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      }
    });
    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 60%",
      onEnter: () => timeline.play()
    });
  }

  $("[words-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".word"), { opacity: 0, yPercent: 100, duration: 0.5, ease: "back.out(2)", stagger: { amount: 0.5 } });
    createScrollTrigger($(this), tl);
  });

  $("[words-rotate-in]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.set($(this).find(".word"), { transformPerspective: 1000 });
    tl.from($(this).find(".word"), { rotationX: -90, duration: 0.6, ease: "power2.out", stagger: { amount: 0.6 } });
    createScrollTrigger($(this), tl);
  });

  $("[words-slide-from-right]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".word"), { opacity: 0, x: "1em", duration: 0.6, ease: "power2.out", stagger: { amount: 0.2 } });
    createScrollTrigger($(this), tl);
  });

  $("[letters-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), { yPercent: 100, duration: 0.2, ease: "power1.out", stagger: { amount: 0.6 } });
    createScrollTrigger($(this), tl);
  });

  $("[letters-slide-down]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), { yPercent: -120, duration: 0.3, ease: "power1.out", stagger: { amount: 0.7 } });
    createScrollTrigger($(this), tl);
  });

  $("[letters-fade-in]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), { opacity: 0, duration: 0.2, ease: "power1.out", stagger: { amount: 0.8 } });
    createScrollTrigger($(this), tl);
  });

  $("[letters-fade-in-random]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), { opacity: 0, duration: 0.05, ease: "power1.out", stagger: { amount: 0.4, from: "random" } });
    createScrollTrigger($(this), tl);
  });

  $("[scrub-each-word]").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 90%",
        end: "top center",
        scrub: true
      }
    });
    tl.from($(this).find(".word"), { opacity: 0.2, duration: 0.2, ease: "power1.out", stagger: { each: 0.4 } });
  });

  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });
});




// SCROLL PANNELS

$("[tr-scroll-toggle='component']").each(function (index) {
  // get elements
  let component = $(this);
  let lists = component.find("[tr-scroll-toggle='list']");
  // set item total
  let itemTotal = lists.first().children().length;
  component.find("[tr-scroll-toggle='number-total']").text(itemTotal);
  // create trigger divs & spacer
  let firstTrigger = component.find("[tr-scroll-toggle='trigger']").first();
  for (let i = 1; i < itemTotal; i++) {
    firstTrigger.clone().appendTo(component);
  }
  let triggers = component.find("[tr-scroll-toggle='trigger']");
  firstTrigger.css("margin-top", "-100vh");
  let trSpacer = $("<div class='tr-scroll-toggle-spacer' style='width: 100%; height: 100vh;'></div>").hide().appendTo(component);
  // check for min width
  let minWidth = 0;
  let trMinWidth = component.attr("tr-min-width");
  if (trMinWidth !== undefined && trMinWidth !== false) {
    minWidth = +trMinWidth;
  }
  // main breakpoint
  gsap.matchMedia().add(`(min-width: ${minWidth}px)`, () => {
    // show spacer
    trSpacer.show();
    // switch which item is active
    function makeItemActive(activeIndex) {
      component.find("[tr-scroll-toggle='transform-y']").css("transform", `translateY(${activeIndex * -100}%)`);
      component.find("[tr-scroll-toggle='transform-x']").css("transform", `translateX(${activeIndex * -100}%)`);
      component.find("[tr-scroll-toggle='number-current']").text(activeIndex + 1);
      lists.each(function (index) {
        $(this).children().removeClass("is-active");
        $(this).children().eq(activeIndex).addClass("is-active");
      });
    }
    makeItemActive(0);
    // scroll to trigger div on click of anchor
    let anchorLinks = component.find("[tr-anchors]").children();
    anchorLinks.on("click", function () {
      let myIndex = $(this).index();
      let scrollDistance = triggers.eq(myIndex).offset().top + triggers.eq(myIndex).height() - 1;
      $("html, body").animate({ scrollTop: scrollDistance });
    });
    // triggers timeline
    triggers.each(function (index) {
      let triggerIndex = index;
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          start: "top top",
          end: "bottom top",
          scrub: true,
          onToggle: ({ self, isActive }) => {
            if (isActive) {
              makeItemActive(triggerIndex);
            }
          }
        },
        defaults: {
          ease: "none"
        }
      });
      lists.each(function () {
        let childItem = $(this).children().eq(triggerIndex);
        tl.to(childItem.find("[tr-item-animation='scale-to-1']"), { scale: 1 }, 0);
        tl.from(childItem.find("[tr-item-animation='scale-from-1']"), { scale: 1 }, 0);
        tl.to(childItem.find("[tr-item-animation='progress-horizontal']"), { width: "100%" }, 0);
        tl.to(childItem.find("[tr-item-animation='progress-vertical']"), { height: "100%" }, 0);
        tl.to(childItem.find("[tr-item-animation='rotate-to-0']"), { rotation: 0 }, 0);
        tl.from(childItem.find("[tr-item-animation='rotate-from-0']"), { rotation: 0 }, 0);
      });
    });
    // component timeline
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: component,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      },
      defaults: {
        ease: "none"
      }
    });
    tl.to(component.find("[tr-section-animation='scale-to-1']"), { scale: 1 }, 0);
    tl.from(component.find("[tr-section-animation='scale-from-1']"), { scale: 1 }, 0);
    tl.to(component.find("[tr-section-animation='progress-horizontal']"), { width: "100%" }, 0);
    tl.to(component.find("[tr-section-animation='progress-vertical']"), { height: "100%" }, 0);
    tl.to(component.find("[tr-section-animation='rotate-to-0']"), { rotation: 0 }, 0);
    tl.from(component.find("[tr-section-animation='rotate-from-0']"), { rotation: 0 }, 0);
    // optional scroll snapping
    if (component.attr("tr-scroll-snap") === "true") {
      let tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: component,
          start: "top top",
          end: "bottom bottom",
          snap: {
            snapTo: "labelsDirectional",
            duration: { min: 0.01, max: 0.2 },
            delay: 0.0001,
            ease: "power1.out"
          }
        }
      });
      triggers.each(function (index) {
        tl2.to($(this), { scale: 1, duration: 1 });
        tl2.addLabel("trigger" + index);
      });
    }
    // smaller screen sizes
    return () => {
      trSpacer.hide();
      component.find("[tr-scroll-toggle='transform-y']").css("transform", "translateY(0%)");
      component.find("[tr-scroll-toggle='transform-x']").css("transform", "translateX(0%)");
      lists.each(function (index) {
        $(this).children().removeClass("is-active");
      });
    };
  });
});









//RECENT PROJECTS STICKY GALLERY CMS


// ON PAGE LOAD
let cmsItem = $(".work_item");
let count = 0;
let rotations = [-30, 45, -50, 25, -52, 60];
// Update text of total slide count
$(".info_p.is-total-slides").text(cmsItem.length);
// Create number text for each cms item
cmsItem.each(function (index) {
  if (index > 0) {
    let clone = $(".info_p.is-slide-number").eq(0).clone();
    clone.text(index + 1);
    clone.appendTo(".info_num-move");
  }
});

// ON SLIDE CHANGE
function makeActive(index) {
  cmsItem.removeClass("active");
  cmsItem.eq(index).addClass("active");
  $(".info_num-move").css("transform", `translateX(${index * -100}%)`);
}
makeActive(0);

// SCROLL INTERACTIONS
$(".triggers").each(function (index) {
  let targetItem = cmsItem.eq(index);

  // Cycle through rotations array
  let rotation = rotations[count];
  count++;
  if (count === rotations.length) {
    count = 0;
  }

  // ON SCROLL INTO VIEW
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: $(this),
      start: "top top",
      end: "bottom top",
      toggleActions: "restart none none reverse",
      onEnter: () => {
        makeActive(index);
      },
      onEnterBack: () => {
        makeActive(index);
      }
    }
  });
  // Apply interaction to all items except the first
  if (index !== 0) {
    tl.from(
      targetItem.find(".work_image-wrap"),
      {
        duration: 0.5,
        clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
        rotate: rotation
      },
      0
    )
      .from(
        targetItem.find(".work_image"),
        {
          duration: 0.5,
          rotate: rotation * -1
        },
        0
      )
      .from(
        targetItem.find(".work_tag"),
        {
          opacity: 0,
          duration: 0.3,
          ease: "power1.out",
          stagger: {
            from: "start",
            each: 0.1
          }
        },
        0.5
      )
      .from(
        targetItem.find(".work_title"),
        {
          y: "5.5em",
          scaleY: 5,
          duration: 0.6,
          ease: "power1.out"
        },
        0.5
      )
      .from(
        targetItem.find(".work_link"),
        {
          duration: 0.5,
          opacity: 0
        },
        0.5
      );
  }

  // ON - WHILE SCROLLING
  let tlScrub = gsap.timeline({
    scrollTrigger: {
      trigger: $(this),
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  });
  tlScrub.to(
    targetItem.find(".work_image"),
    {
      scale: 1.2,
      duration: 1,
      ease: "power2.in"
    },
    0
  );
});
</script>

<script>
// FOOTER HOVER INTERACTIONS --------------------------------------

let imageTL = gsap.timeline({
  paused: true
});
imageTL.to(".footer_image", {
  y: "0vh",
  x: "0vw",
  duration: 0.8,
  ease: "power1.out",
  invalidateOnRefresh: true,
  onReverseComplete: clearStyles,
  stagger: {
    each: 0.25,
    from: "start"
  }
});
let linkTL = gsap.timeline({
  paused: true,
  clearProps: "all"
});
linkTL.to(".footer_pill", {
  width: "100%",
  duration: 0.4,
  ease: "power1.out",
  onReverseComplete: clearStyles
});
function clearStyles() {
  for (var i = 0; i < this.targets().length; i++) {
    gsap.set(this.targets()[i], { clearProps: "all" });
  }
}
$(".footer_pill").on("mouseenter", function () {
  imageTL.timeScale(1);
  imageTL.restart();
  linkTL.restart();
});
$(".footer_pill").on("mouseleave", function () {
  imageTL.timeScale(1.5);
  if (imageTL.progress() === 1) {
    setTimeout(() => {
      imageTL.timeScale(2.4);
      imageTL.reverse();
    }, 600);
  } else {
    imageTL.reverse();
  }
  linkTL.reverse();
});
// EMAIL LINK
let emailTL = gsap.timeline({
  paused: true
});
emailTL
  .to(".hello", {
    x: "3.9em",
    duration: 0.4,
    ease: "power1.out"
  })
  .to(
    ".footer_link-arrow-side",
    {
      x: "100%",
      duration: 0.4,
      ease: "power1.out"
    },
    0
  )
  .to(
    ".footer_link-arrow-top",
    {
      y: "0%",
      duration: 0.4,
      ease: "power1.out"
    },
    0
  );
$(".footer_link").on("mouseenter", function () {
  emailTL.restart();
});
$(".footer_link").on("mouseleave", function () {
  emailTL.reverse();
});
let windowWidth = window.innerWidth;
window.addEventListener("resize", function () {
  if (window.innerWidth !== windowWidth) {
    windowWidth = window.innerWidth;
    imageTL.invalidate();
  }
});
