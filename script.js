/**
 * Initializes the date picker and handles events related to the event date display and editing.
 * Also handles the dropdown functionality and marking the event as complete.
 * Provides functionality for adding, editing, and deleting comments.
 */
$(document).ready(function () {
  // Initialize the date picker
  const datepicker = $("#datepicker").datepicker({
    dateFormat: "MM d, yy",
    onSelect: function (dateText) {
      const currentText = $("#event-date").text();
      const timePart = currentText.split(" at ")[1] || "8:00-10:00 AM";
      $("#event-date")
        .html(
          `<i class="fa fa-calendar" aria-hidden="true"></i> ${dateText} at ${timePart}`
        )
        .attr("contenteditable", true);
    },
  });

  // Click to open the date picker or edit the event date
  $("#event-date").on("click", function () {
    const currentText = $(this).text();
    const datePart = currentText.split(" at ")[0].trim();
    const timePart = currentText.split(" at ")[1] || "8:00-10:00 AM";

    const newDate = prompt("Edit date (e.g., Dec 5, 2024):", datePart);
    const newTime = prompt("Edit time (e.g., 8:00-10:00 AM):", timePart);

    if (newDate !== null && newTime !== null) {
      $(this).html(
        `<i class="fa fa-calendar" aria-hidden="true"></i> ${newDate} at ${newTime}`
      );
    } else {
      datepicker.datepicker("show");
    }
  });

  // Handle dropdown click
  $(".custom-dropdown").on("click", function () {
    $(this).toggleClass("open");
  });

  // Handle assignee dropdown change
  $("#assignee-dropdown").on("change", function () {
    $("#assignee-name").text(this.value);
    $(".comment-header span").text(this.value); // Update the name in existing comments
  });

  // Handle marking the event as complete
  $("#complete-btn").on("click", function () {
    $(this).toggleClass("fa-circle-check fa-check-circle");
    $(this).css("color", "#009379");
    showPopup("Thanks for submitting!");
  });

  // Handle adding a new comment
  $(".add-comment button").on("click", function () {
    addComment();
  });

  function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupContent = popup.querySelector(".popup-content p");
    const closeBtn = popup.querySelector(".close-btn");

    popupContent.textContent = message;

    popup.style.display = "block";

    closeBtn.onclick = function () {
      popup.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == popup) {
        popup.style.display = "none";
      }
    };
  }

  // Add a new comment
  function addComment() {
    const commentText = $("#newComment").val().trim();
    if (commentText) {
      const commentSection = $(".comment-box");
      const newCommentId = "comment" + ($(".comment").length + 1);
      const newComment = `
                <div class="comment" id="${newCommentId}">
                    <img class="janeimg" src="/figuser.png" alt="User Avatar">
                    <div class="comment-content">
                        <div class="comment-header">
                            <span>${$(
                              "#assignee-dropdown option:selected"
                            ).text()}</span>
                            <div class="comment-actions">
                                <button onclick="deleteComment('${newCommentId}')"><i class="fa-regular fa-trash-can"></i></button>
                            </div>
                        </div>
                        <p onclick="editComment('${newCommentId}', this)">
                            ${commentText}
                        </p>
                    </div>
                </div>`;
      commentSection.append(newComment);
      $("#newComment").val("");
    }
  }

  // Edit a comment by clicking on it
  window.editComment = function (commentId, commentElement) {
    const currentText = $(commentElement).text();
    const newText = prompt("Edit your comment:", currentText);
    if (newText) {
      $(commentElement).text(newText);
    }
  };

  // Delete a comment
  window.deleteComment = function (commentId) {
    $(`#${commentId}`).remove();
  };
});
