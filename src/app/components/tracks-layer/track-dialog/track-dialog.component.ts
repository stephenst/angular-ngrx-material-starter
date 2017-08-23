import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const TrackDataQuery = gql`
    query TrackData($id: String!) {
        track(id: $id){
            from
            to
            type
        }
    }
`;


@Component({
  selector: 'anms-trackdialog',
  templateUrl: './track-dialog.component.html',
  styleUrls: ['./track-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TracksDialogComponent implements OnInit, OnDestroy {
  private readonly POLL_INTERVAL = 2000;
  public track$: Observable<any>;
  public track: {};
  private stopper$ = new Subject();
  private singleTrackQuery$: {};

  constructor(@Inject(MD_DIALOG_DATA) private data: any,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.track = this.data.track;
    this.track$ = this.data.trackObservable;
  }

  private changeTrackPosToDeg(track) {
    const pos = Cesium.Cartographic.fromCartesian(track.position);
    this.track.position = {
      lat: TracksDialogComponent.toDegrees(pos.latitude),
      long: TracksDialogComponent.toDegrees(pos.longitude),
      alt: track.alt
    };
  }

  ngOnDestroy() {
    if (this.singleTrackQuery$) {
      this.singleTrackQuery$.stopPolling();
    }
    this.stopper$.next(true);
  }

  static toDegrees(value) {
    const result = Math.round((360 - (180 * value / Math.PI) % 360.0) * 100) / 100;
    return result < 0 ? result + 360 : result;
  }

  static fixTextSize(text) {
    if (text && text.length > 25) {
      return text.slice(0, 25).concat('...');
    }
  }
}
