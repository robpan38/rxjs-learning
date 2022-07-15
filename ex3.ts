import {
  concatMap,
  delay,
  fromEvent,
  interval,
  of,
} from 'rxjs';

let summary = document.querySelector<HTMLDivElement>(".summary")!;
let pauseBtn = document.querySelector<HTMLButtonElement>("button")!;
let paused = false;
let lastNotification = 0;
let notificationEmitter

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

function startNotificationEmitter() {
    let notificationEmitter = interval(1200)
    .subscribe({
        next: (value) => {
            if (paused) {
                notificationQueue.push(value);
                console.log(notificationQueue);
            }
            else {
                let currentNotificationTitle = document.querySelector<HTMLParagraphElement>(".always-present-notification .notification-title")!;
                currentNotificationTitle.innerText = `Titlu ${value}`;
            }
        }
    });
}


let detectPauseClick = fromEvent(pauseBtn, "click")
    .subscribe(() => {
        if (paused) {
            summary.innerHTML = "";
            paused = false;
            pauseBtn.innerText = "PAUSE NOTIFICATIONS";

            let pausedNotifications = of(...notificationQueue)
                .pipe(concatMap((number) => of(number).pipe(delay(1000))))
                .subscribe({
                    next: (number) => addNotificationToSummary(number.toString(), "Acesta este textul notificarii"),
                    complete: () => {
                        notificationQueue = [];
                    }
                })
        } else {
            paused = true;
            pauseBtn.innerText = "RESUME NOTIFICATIONS";
        }
    })

startNotificationEmitter();