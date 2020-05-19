import { Component, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, merge, EMPTY, Subject } from 'rxjs';
import { tap, mapTo, switchMap, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();

  ngOnInit() {
    const send$ = fromEvent(document.getElementById('send'), 'click');
    const stop$ = fromEvent(document.getElementById('stop'), 'click').pipe(mapTo('stop'));
    const restart$ = fromEvent(document.getElementById('restart'), 'click').pipe(mapTo('restart'));
  
    const logging$ = send$.pipe(
      tap((event) => console.log('Time: ', new Date()))
    );
    
    merge(restart$, stop$)
      .pipe(
        startWith('restart'),
        switchMap(v => 
          (v === 'stop') ? EMPTY : logging$
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
