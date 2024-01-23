import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  [x: string]: any;
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string | null = '';
  post: Post = { id: '', title: '', content: '', imagePath:'' };
  form!: FormGroup;
  isLoading = false;
  imagePreview!: string | null | ArrayBuffer;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // this.form = this.fb.group({
    //   title: ['', Validators.required],
    //   content: ['', Validators.required]
    // });
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl('', { validators: [Validators.required] }),
      image: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') || ''; // Handle null by using `||`
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath:postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image:this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else if (this.mode === 'edit' && this.postId !== null) {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const files: FileList | null = (event.target as HTMLInputElement).files;

    if (files === null || files.length === 0) {
      console.error('No file selected.');
      return;
    }

    const file: File = files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
