const feedbackForm = document.getElementById("feedback-form");
if (feedbackForm) {
    const errorBox = document.getElementById("feedback-error");
    const resultBox = document.getElementById("feedback-result");
 
    feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault();
        hideMessage(errorBox);
        hideMessage(resultBox);
 
        const name = document.getElementById("fb-name").value.trim();
        const rating = Number(document.getElementById("fb-rating").value);
        const comments = document.getElementById("fb-comments").value.trim();
 
        if (rating < 1 || rating > 5) {
            showMessage(errorBox, "Rating must be between 1 and 5.");
        } else if (comments.length < 10) {
            showMessage(errorBox, "Please write at least 10 characters in your comments.");
        } else {
            showMessage(resultBox, "Thank you, " + name + "! You rated us " + rating + "/5.");
            feedbackForm.reset();
        }
    });
 
    // Clear form also hides old messages
    feedbackForm.addEventListener("reset", function () {
        hideMessage(errorBox);
        hideMessage(resultBox);
    });
}