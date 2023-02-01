import { Body, Controller, Delete, Patch, Post, Query, UseGuards, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { NotesService } from './notes.service';
import { NoteObject } from '../auth/dto';

@UseGuards(JwtGuard)
@Controller('notes')
export class NotesController {
    constructor(private notes: NotesService) {}
    @Post('/create')
    create(@Body() body: NoteObject, @GetUser() user: User) {
        return this.notes.createNotes(body, user);
    }
    @Patch('/edit')
    edit(@Body() body: NoteObject) {
        return this.notes.editNotes(body);
    }
    @Delete('/delete')
    delete(@Body() body: NoteObject) {
        return this.notes.deleteNotes(body);
    }
    @Get('/get')
    get(@GetUser() user: User) {
        return this.notes.getNotes(user);
    }
    @Get('/get/:id')
    getById(@Query('id') id: number) {
        return this.notes.getNoteById(id);
    }
}
