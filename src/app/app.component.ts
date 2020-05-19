import { Component, OnInit } from '@angular/core';
import { fromEvent, merge, EMPTY } from 'rxjs';
import { tap, takeUntil, mapTo, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  name = 'Angular';

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
      )
      .subscribe();
  }
}
