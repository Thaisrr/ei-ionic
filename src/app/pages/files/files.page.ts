import { Component, OnInit } from '@angular/core';
import {FileService} from "../../utils/services/file.service";

@Component({
  selector: 'app-files',
  templateUrl: './files.page.html',
  styleUrls: ['./files.page.scss'],
})
export class FilesPage implements OnInit {

  text: string;
  message: string;
  file: string;
  files: string[];

  constructor(
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.readAll();
  }

  write() {
    if(this.text) {
      this.fileService.write(this.text, this.file)
        .then(() => {
          this.text = '';
          this.readAll();
        });
    }
  }

  async read() {
    const {data} = await this.fileService.read(this.file);
    this.message = data;
  }

  append() {
    if(this.files.includes(this.file) && this.text) {
      this.fileService.append(this.text, this.file)
        .then(() => {
          this.text = '';
          this.read();
        });
    }
  }

  async delete() {
    await this.fileService.delete(this.file);
    await this.readAll();
  }

  async readAll() {
    const {files} = await this.fileService.getAll();
    this.files = files;
    console.log(files);
  }

  changeFile(f) {
    this.file = f;
    this.read();
  }

}
