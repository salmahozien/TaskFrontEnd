import { formatDate } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;
  private drawing = false;
  userData: FormData = new FormData();
  showFileInput = true;
  isSubmet = false;
  Images: File[] = [];

  UserFormFields: FormGroup = new FormGroup({
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    PhoneNumber: new FormControl('', [Validators.required]),
  });

  constructor(
    private userServis: UserService,
    private _ActivatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngAfterViewInit() {
    this.ctx = this.signatureCanvas.nativeElement.getContext('2d');
    if (this.ctx) {
      this.setupCanvas();
    }
  }

  private setupCanvas() {
    const canvas = this.signatureCanvas.nativeElement;
    canvas.addEventListener('mousedown', () => this.startDrawing());
    canvas.addEventListener('mousemove', (event) => this.draw(event));
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mouseout', () => this.stopDrawing());
    // Add touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startDrawing();
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.drawTouch(e);
    });
    canvas.addEventListener('touchend', () => this.stopDrawing());
  }

  private startDrawing() {
    this.drawing = true;
  }

  private stopDrawing() {
    this.drawing = false;
    if (this.ctx) {
      this.ctx.beginPath();
    }
  }

  private draw(event: MouseEvent) {
    if (!this.drawing || !this.ctx) return;
    const canvas = this.signatureCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  private drawTouch(event: TouchEvent) {
    if (!this.drawing || !this.ctx) return;
    const canvas = this.signatureCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  clearSignature(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.signatureCanvas.nativeElement.width, this.signatureCanvas.nativeElement.height);
    }
  }

  private getSignatureFile(): File | null {
    const canvas = this.signatureCanvas.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    // Check if canvas is empty
    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = canvas.width;
    emptyCanvas.height = canvas.height;
    if (dataUrl === emptyCanvas.toDataURL()) return null;
    const blob = this.dataURLtoBlob(dataUrl);
    return new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
  }

  private dataURLtoBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const match = arr[0].match(/:(.*?);/);
    if (!match) {
      throw new Error('Invalid data URL format');
    }
    const mime = match[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  UploadImages(event: any): void {
    this.Images = Array.from(event.target.files);
  }

  FinalSave(): void {
    if (this.UserFormFields.invalid) {
      Swal.fire({
        title: 'Missing Required Data!',
        text: 'Please fill all required fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const signatureFile = this.getSignatureFile();
    if (!signatureFile && this.Images.length === 0) {
      Swal.fire({
        title: 'Missing Data!',
        text: 'Please provide a signature or upload images.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.userData = new FormData();
    this.userData.append('FirstName', this.UserFormFields.value.FirstName);
    this.userData.append('LastName', this.UserFormFields.value.LastName);
    this.userData.append('Email', this.UserFormFields.value.Email);
    this.userData.append('PhoneNumber', this.UserFormFields.value.PhoneNumber);

    if (signatureFile) {
      this.userData.append('Signature', signatureFile);
    }

    this.Images.forEach(file => this.userData.append('Images', file));

    this.userServis.AddUserDetails(this.userData).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'User added successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this._router.navigate(['/AllUsers']);
        });
        this.isSubmet = true;
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: error.error || 'An error occurred.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error(error);
      }
    });
  }

  ResetForm(): void {
    this.UserFormFields.reset();
    this.clearSignature();
    this.Images = [];
    this.showFileInput = false;
    setTimeout(() => (this.showFileInput = true), 0);
  }

  BackToList(): void {
    this._router.navigate(['/AllUsers']);
  }
}