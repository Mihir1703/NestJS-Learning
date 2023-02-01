import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { NoteObject } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
    constructor(private prisma: PrismaService) {}
    async createNotes(body: NoteObject, user: User) {
        const authorId = user.id;
        const notes = await this.prisma.notes.create({
            data: {
                authorId,
                ...body,
            },
        });
        delete notes.authorId;
        return notes;
    }
    async editNotes(body: NoteObject) {
        const noteId = body.id;
        const notes = await this.prisma.notes.update({
            where: { id: noteId },
            data: { ...body },
        });
        delete notes.authorId;
        return notes;
    }
    async deleteNotes(body: NoteObject) {
        const noteId = body.id;
        const notes = await this.prisma.notes.delete({
            where: { id: noteId },
        });
        delete notes.authorId;
        return notes;
    }
    async getNotes(user: User) {
        const authorId = user.id;
        const notes = await this.prisma.notes.findMany({
            where: { authorId },
        });
        return notes;
    }
    async getNoteById(id: number) {
        const notes = await this.prisma.notes.findFirst({
            where: { id: id },
        });
        return notes;
    }
}
