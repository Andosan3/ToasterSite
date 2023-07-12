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







// DRAGGABLE INTERACTION
gsap.registerPlugin(Draggable);
let draggableTimeline;
let draggableItem = $(".box");
let draggableContainer = $(".box-contain");

// Create a draggable element and animation
function createDraggable() {
  var midPoint =
    draggableContainer.innerWidth() / 2 - draggableItem.innerWidth() / 2;
  var endPoint = draggableContainer.innerWidth() - draggableItem.innerWidth();

  // Sync the draggable item with the animation timeline
  function updateTimeline(draggableObject) {
    let myVar = draggableObject.x / draggableObject.maxX;
    draggableTimeline.progress(myVar);
  }

  // Create draggable item
  Draggable.create(draggableItem, {
    type: "x",
    bounds: draggableContainer,
    inertia: true,
    // onDrag
    onDrag: function (e) {
      updateTimeline(this);
    },
    onMove: function (e) {
      updateTimeline(this);
    },
    onThrowUpdate: function (e) {
      updateTimeline(this);
    },
    maxDuration: 0.4,
    snap: { x: [0, Math.round(midPoint), Math.round(endPoint)] }
  });

  // Create drag timeline animation
  draggableTimeline = gsap.timeline({
    paused: true,
    defaults: { ease: Linear.easeNone }
  });
  let myScale = 2;
  draggableTimeline.fromTo(
    ".box-inner",
    {
      duration: 1,
      scaleY: 1,
      scaleX: 1,
      borderRadius: "3em"
    },
    {
      duration: 1,
      scaleY: myScale,
      scaleX: myScale,
      borderRadius: "1em"
    }
  );
  draggableTimeline.fromTo(
    ".box-inner",
    {
      duration: 1,
      scaleY: myScale,
      scaleX: myScale,
      borderRadius: "1em"
    },
    {
      duration: 1,
      scaleY: 1,
      scaleX: 1,
      borderRadius: "3em"
    }
  );
  draggableTimeline.progress(1.5);
}

// Whenever the window is resized, restart draggable
$(window).resize(function () {
  draggableTimeline.kill();
  Draggable.get(".box").kill();
  draggableItem.css("transform", "translate(0)");
  createDraggable();
});
createDraggable();

// SCROLL INTERACTION
let click = document.getElementById("click");
click.load();
gsap.registerPlugin(ScrollTrigger);

// On page load set image to first collection item image
$(".image").attr("src", $(".work_item").eq(0).find(".work_img").attr("src"));

// Anytime item is scrolled into view
function updateImages(currentItem) {
  $(".work_item").removeClass("active");
  currentItem.addClass("active");
  let imageSrc = currentItem.find(".work_img").attr("src");
  $(".image").attr("src", imageSrc);
  click.currentTime = 0;
  click.play();
}

// Scroll into view trigger
$(".work_item").each(function (index) {
  let triggerElement = $(this);
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      // trigger element - viewport
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        updateImages(triggerElement);
      },
      onEnterBack: () => {
        updateImages(triggerElement);
      }
    }
  });
});

