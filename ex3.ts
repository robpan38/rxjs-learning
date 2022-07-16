import {
  combineLatest,
  fromEvent,
  interval,
  map,
  startWith,
} from 'rxjs';

let summary = document.querySelector<HTMLDivElement>(".summary")!;
let pauseBtn = document.querySelector<HTMLButtonElement>("button")!;

function createNotification(title: string, text:string): HTMLDivElement {
    let notificationContainer = document.createElement('div');
    let notificationTitle = document.createElement('p');
    let notificationText = document.createElement('p');

    notificationTitle.innerText = title;
    notificationText.innerText = text;
    notificationContainer.append(notificationTitle, notificationText);
    
    notificationContainer.classList.add("current-notification");
    notificationTitle.classList.add("notification-title");
    notificationText.classList.add("notification-text");

    return notificationContainer;
}

function addNotificationToSummary(title: string, text: string): void {
    summary?.append(createNotification(title, text));
}

let notificationQueue: number[] = [];

let notifications$ = interval(1200);

let paused$ = fromEvent(pauseBtn, "click")
    .pipe(
        map((e) => {
            let targetBtn = e.target;
            if ((targetBtn as HTMLButtonElement).innerText === "PAUSE NOTIFICATIONS") {
                return true;
            } else {
                return false;
            }
        }),
        startWith(false)
    )

let combined$ = combineLatest(notifications$, paused$)
    .subscribe(pair => {
        let [title, pauseState] = pair;

        if (pauseState === true) {
            pauseBtn.innerText = "RESUME NOTIFICATIONS";
        } else {
            pauseBtn.innerText = "PAUSE NOTIFICATIONS";
        }

        if (pauseState === true) {
            notificationQueue.push(title);
            summary.innerHTML = "";
        } else {
            let currentNotificationTitle = document.querySelector<HTMLParagraphElement>(".always-present-notification .notification-title")!;
            currentNotificationTitle.innerText = `Titlu ${title}`;

            notificationQueue.forEach(notification => {
                addNotificationToSummary(notification.toString(), "Acesta este titlul notificarii");
            })
            notificationQueue = [];
        }
    });