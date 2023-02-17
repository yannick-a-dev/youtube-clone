import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoDto } from '../video-dto';


@Component({
  selector: 'app-save-video-details',
  templateUrl: './save-video-details.component.html',
  styleUrls: ['./save-video-details.component.css']
})
export class SaveVideoDetailsComponent implements OnInit {

  savedVideoDetailsForm: FormGroup;
  title: FormControl = new FormControl('');
  description: FormControl = new FormControl('');
  videoStatus: FormControl = new FormControl('');
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;
  tags: string[] = [];
  selectedFile: File;
  selectedFileName = '';
  videoId = '';
  fileSelected = false;
  videoUrl: string;
  thumbnailUrl: string;


  constructor(private videoService: VideoService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar) {
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
    this.videoService.getVideo(this.videoId).subscribe(data => {
      this.videoUrl = data.videoUrl;
      this.thumbnailUrl = data.thumbnailUrl;
    })
    this.savedVideoDetailsForm = new FormGroup({
      title: this.title,
      description: this.description,
      videoStatus: this.videoStatus
    })
  }

  ngOnInit(): void {

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(value: string): void {
    const index = this.tags.indexOf(value);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onFileSelected(event: Event) {
    this.selectedFileName = this.selectedFile.name;
    this.fileSelected = true;
  }

  unUpload() {
    this.videoService.uploadThumbnail(this.selectedFile, this.videoId)
      .subscribe(data => {
        console.log(data);
        //show an upload notification
        this._snackBar.open("Thumbnail Upload Successful", "OK");

      })
  }

  saveVideo() {
    //make the video service to make a http call to our backend
    const videoMetadata: VideoDto = {
      "id": this.videoId,
      "title": this.savedVideoDetailsForm.get('title')?.value,
      "description": this.savedVideoDetailsForm.get('description')?.value,
      "tags": this.tags,
      "videoStatus": this.savedVideoDetailsForm.get('videoStatus')?.value,
      "videoUrl": this.videoUrl,
      "thumbnailUrl": this.thumbnailUrl
    }
    this.videoService.saveVideo(videoMetadata).subscribe(data => {
      this._snackBar.open("Video Metadata Updated successfully", "OK");
    })
  }

}
