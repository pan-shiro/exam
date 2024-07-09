export default function Instructions() {
    return (
        <ol className="list-decimal px-2 space-y-1">
        <li>Choose a category and click the button to begin</li>
        <li>This quiz is comprised of multiple choices. Choose the correct one and click <em>Next</em></li>
        <li>You have 30 seconds for each question. If you fail to choose an option before the timer ends, a random option will be chosen</li>
        <li>At the end, a score will be calculated and shown</li>
        <li>You may try as many times as you want.</li>
      </ol>
    );
}