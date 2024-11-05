import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CagnotteModalComponent } from './cagnotte-modal.component';

describe('CagnotteModalComponent', () => {
  let component: CagnotteModalComponent;
  let fixture: ComponentFixture<CagnotteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CagnotteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CagnotteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
