import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform, Dimensions } from 'ngx-image-cropper';
// import { MessageService } from 'projects/ats-global-system-external/src/app/core/services/message.service';
import { FILE_UPLOAD } from 'projects/ats-global-system-external/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system-external/src/app/core/common/global-common-method.service';
@Component({
  selector: 'app-image-cropper-mop',
  templateUrl: './image-cropper-mop.component.html',
  styleUrls: ['./image-cropper-mop.component.scss']
})
export class ImageCropperMopComponent implements OnInit {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  profileImage;
  imageSize;
  public selectedImage: any;
  public orginalImage: any;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public canvasRotation = 0;
  public rotation = 0;
  public scale = 1;
  public showCropper = false;
  public containWithinAspectRatio = false;
  public transform: ImageTransform = {};
  public fileName: string;
  public fileDimension: any;
  acceptedFile = 'image/png,image/jpeg,image/jpg';
  public displayName: string;
  public uniqueFileName: string;
  public imageDetails: any;
  public loader: boolean = false;
  public aspectRatio: number = 1 / 1;
  public imageQuality: number = 80;
  public cropperMinWidth: number = 255;
  public cropperMinHeight: number = 140;
  public roundCropper: boolean = false;
  public modalTitle: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImageCropperMopComponent>,
    private _messageService: ShareService,
    private _commonMethodServe: GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.cropperSetup();
    this.setData();
  }

  /***
   * cropper config
   */
  cropperSetup(): void {
    if (this.data['cropperType'] == "thumbnail") {
      this.aspectRatio = 16 / 9;
      this.cropperMinWidth = 255;
      this.cropperMinHeight = 140;
      this.roundCropper = false;
      this.modalTitle = "Crop Thumbnail Image";
    }
    else if (this.data['cropperType'] == "profileImg") {
      this.aspectRatio = 1 / 1;
      this.cropperMinWidth = 140;
      this.cropperMinHeight = 140;
       this.roundCropper = false;
      this.imageQuality = 50;
      this.modalTitle = "Crop Profile Picture";
    }
    else if (this.data['cropperType'] == "logo") {
      this.aspectRatio = 1 / 1;
      this.cropperMinWidth = 140;
      this.cropperMinHeight = 140;
      this.roundCropper = false;
      this.imageQuality = 50;
      this.modalTitle = "Crop Logo";
    }
  }
  /***
   * set data
   */
  setData() {
    if (this.data['file']) {
      this.selectedImage = this.data['file'];
      this.orginalImage = this.data['file'];
      this.displayName = this.data['displayName'],
        this.uniqueFileName = this.data['uniqueFileName']
    }
  }
  /***
   * crop image method
   */
  crop() {
    this.loader = true;
    this.imageCropper.crop();
  }

  /***
   * close Modal
   */
  closeModal(): void {
    this.dialogRef.close(null);
  }

  /***
   * submit cropped image
   */
  submit() {
    this.imageCropper.crop();
    let data = {
      file: this.selectedImage,
      displayName: this.displayName,
      uniqueFileName: this.uniqueFileName
    }
    this.dialogRef.close(data);
  }
  /***
   * select another image
   */
  fileChangeEvent(event: any): void {
    if (event.target.value) {
      const file = event.target.files[0];
      this.displayName = file.name;
      this.uniqueFileName = +new Date() + this.displayName;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const blob = this._commonMethodServe.base64toBlob(reader.result);
        if (blob.size > FILE_UPLOAD.FILE_SIZE) {
          this._messageService.showAlertErrorMessage.next("File uploaded cannot be greater than 5MB.",)
        }
        else {
          this.selectedImage = reader.result;
          this.orginalImage = reader.result;
        }
      }
    }
  }
  /***
   * after image cropped
   */
  imageCropped(event: ImageCroppedEvent) {
    this.loader = false;
    this.resetImage();
    this.croppedImage = event.base64;
    this.selectedImage = event.base64;
    const blobOne = this._commonMethodServe.base64toBlob(event.base64);
    this.imageSize = (blobOne.size / (1024 * 1024)).toFixed(2);
  }
  /***
   * image load method
   */
  imageLoaded(image: HTMLImageElement) {
    this.loader = false;
    this.imageDetails = image;
  }

  /***
   * ready to crop method
   */
  cropperReady(sourceImageDimensions: Dimensions) {
    this.loader = false;
    this.fileDimension = sourceImageDimensions;
  }

  /***
   * image load failed
   */
  loadImageFailed() {
    this.loader = false;
    this._messageService.showAlertErrorMessage.next('Failed to load image because the file appears to be damaged or corrupted.')
  }

  /***
   * rotate left;
   */
  rotateLeft() {
    this.loader = true;
    this.canvasRotation--;
    this.flipAfterRotate();
  }
  /***
   * rotate right
   */
  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }
  /***
   * reset image
   */
  resetImage() {
    this.selectedImage = this.orginalImage;
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

}
