import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './seats.component.html',
  styleUrl: './seats.component.scss',
})
export class SeatsComponent implements OnInit {
  profileForm!: FormGroup;
  lockSubmitButton = false;
  formSubmitted = false;

  constructor(private httpService: HttpService, private toastr:ToastrService) {}
  seats: any = [];
  ngOnInit(): void {
    this.initializeForm();
    this.getAllSeatsInfo();
  }

  initializeForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      noOfSeats: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(80),
      ]),
    });
  }

  getAllSeatsInfo() {
    this.httpService.get('seat', {}).subscribe({
      next: (res: any) => {
        this.seats = Object.entries(res.seats);
      },
      error:(err)=>{
        this.toastr.error(err.error.message);
      }
    });
  }

  public get f() {
    return this.profileForm.controls;
  }

  onSubmit() {
    this.formSubmitted = true;
    if (!this.profileForm.valid) {
      console.log(this.profileForm.valid);
      return;
    }
    if (this.lockSubmitButton) return;
    this.lockSubmitButton = true;
    const payload = {
      seatsRequired: this.f['noOfSeats'].value,
      userName: this.f['name'].value,
    };
    this.httpService.post('seat/book', payload).subscribe({
      next: (res) => {
        this.profileForm.reset();
        this.getAllSeatsInfo();
        this.toastr.info('Seats booked successfully!');
        this.formSubmitted = false;
        this.lockSubmitButton = false;
      },
      error: (err) => {
        this.lockSubmitButton = false;
        this.toastr.error(err.error.message);
      },
    });
  }

  resetBooking() {
    if (this.lockSubmitButton) return;
    this.lockSubmitButton = true;
    this.httpService.post('seat/initialize-seats', {}).subscribe({
      next: (res) => {
        this.lockSubmitButton = false;
        this.getAllSeatsInfo();
        this.toastr.info('Seats has been reset!');
      },
      error: (err) => {
        this.lockSubmitButton = false;
        this.toastr.error(err.error.message);
      },
    });
  }
}
