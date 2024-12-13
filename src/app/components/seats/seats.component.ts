import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './seats.component.html',
  styleUrl: './seats.component.scss',
})
export class SeatsComponent implements OnInit {


  profileForm!:FormGroup;
  lockSubmitButton = false;
  formSubmitted = false;

  constructor(private httpService: HttpService) {

  }
  seats: any;
  ngOnInit(): void {
    this.initializeForm();
    this.getAllSeatsInfo();
  }

  initializeForm(){
    this.profileForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      noOfSeats: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(80)
      ])
    });
  }

  getAllSeatsInfo() {
    this.httpService.get('seat', {}).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  
  public get f(){
    return this.profileForm.controls;
  }

  onSubmit(){
    this.formSubmitted = true;
    if(!this.profileForm.valid){
      
      return;
    }
    if(this.lockSubmitButton) return;
    this.lockSubmitButton = true;
    const payload = {
      seatsRequired: this.f['noOfSeats'].value,
      userName:this.f['name'].value
    }
    this.httpService.post('seat/book', payload).subscribe({
      next:(res)=>{
        this.getAllSeatsInfo();
      },
      error:(err)=>{

      }
    })
  }
}
