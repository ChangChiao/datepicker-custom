window.onload = () => {
  console.clear();
  // ===== DOM Elements ===== //
  const universalDate = document.querySelector("#datepicker");
  const twDate = document.querySelector("#datepickerTW");

  // ===== English Calendar ===== //
  const datePicker = flatpickr(universalDate, {
    enableTime: true,
    defaultDate: "today",
    time_24hr: false,
    minDate: "1911.01.01",
    dateFormat: "d-m-Y",
    altInput: true,
    altFormat: "F j ,Y. D h:iK",
  });

  // ===== 中文 Calendar ===== //
  // Reference: https://tipsfordev.com/flatpickr-adding-dropdown-to-change-year
  const FLATPICKR_CUSTOM_YEAR_SELECT = "flatpickr-custom-year-select";
  const momentDateFormat = "YYYY-M-DD-LT";
  const transYear = (year) => {
    return Number(year) - 1911;
  };

  const addProfix = (year) => {
    return year > 0 ? "民國" + year : "民國前" + Math.abs(year - 1);
  };
  const datePickerTW = flatpickr(twDate, {
    locale: "zh_tw",
    mode: "range",
    minDate: "01,01,1911",
    maxDate: "01,01,2030",
    dateFormat: momentDateFormat,
    formatDate: convertDateFormat,
    onReady: function (selectedDates, dateStr, instance) {
      // Step1: hide original year input
      const flatpickrYearElement = instance.currentYearElement;
      const children = flatpickrYearElement.parentElement.children;
      for (let i in children) {
        if (children.hasOwnProperty(i)) {
          children[i].style.display = "none";
        }
      }
      // Step2: create dropdown select
      const yearSelect = document.createElement("select");
      const minYear = new Date(instance.config._minDate).getFullYear();
      const maxYear = new Date(instance.config._maxDate).getFullYear();

      console.warn(
        "new Date(instance.config._minDate).getFullYear()",
        new Date(instance.config._minDate).getFullYear()
      );
      console.warn("minYear", minYear);
      for (let i = minYear; i < maxYear; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.text = addProfix(transYear(i));
        yearSelect.appendChild(option);
      }
      // Step3: add event listener for select
      yearSelect.addEventListener("change", function (event) {
        flatpickrYearElement.value = event.target["value"];
        instance.currentYear = parseInt(event.target["value"]);
        instance.redraw();
      });
      //Step4: add classes and id to yearSelect and append it to yearEl
      yearSelect.className = "flatpickr-monthDropdown-months";
      yearSelect.id = FLATPICKR_CUSTOM_YEAR_SELECT;
      yearSelect.value = instance.currentYearElement.value;
      console.error(
        "instance.currentYearElement.value",
        instance.currentYearElement.value
      );

      flatpickrYearElement.parentElement.appendChild(yearSelect);
    },
    onYearChange: function (selectedDates, dateStr, instance) {
      // update custom select year value
      //   const customStr = instance.currentYear
    //   console.warn("currentYear", currentYear);
    //   const customStr = transYear(instance.currentYear);
    //   document.getElementById(FLATPICKR_CUSTOM_YEAR_SELECT).value = customStr;
    },
  });

  // convert date format
  function convertDateFormat(dateObj, formatString, locale) {
    console.warn("dateObj", dateObj, formatString);
    let dateArr = moment(dateObj).format(formatString);
    const [year, month, day] = dateArr.split("-");
    //  result example: '民國 111年 xx月 xx日'
    console.log(
      "`民國${year - 1911}年 ${month}月 ${day}日`",
      `${addProfix(transYear(year))}年 ${month}月 ${day}日`
    );
    return `${addProfix(transYear(year))}年 ${month}月 ${day}日`;
    // return dateArr;
  }

  var a = new Date();
  var b = moment(a).format("F j, Y");
  console.warn("b", b);
};
