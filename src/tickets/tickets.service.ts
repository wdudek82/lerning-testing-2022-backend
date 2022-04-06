import { Injectable } from '@nestjs/common';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority, Status } from './enums';

@Injectable()
export class TicketsService {
  constructor(@InjectRepository(Ticket) private repo: Repository<Ticket>) {}

  create(
    title: string,
    description: string,
    authorId: number,
    assigneeId: number,
    priority: Priority,
    status: Status,
    relatedTicketId: number,
  ): Promise<Ticket> {
    const ticket = this.repo.create({
      title,
      description,
      authorId,
      assigneeId,
      priority,
      status,
      relatedTicketId,
    });
    return this.repo.save(ticket);
  }

  findAll(title = ''): Promise<Ticket[]> {
    return this.repo
      .createQueryBuilder('ticket')
      .where('ticket.title ilike :title', { title: `%${title}%` })
      .getMany();
  }

  async findById(id: number): Promise<Ticket | null> {
    // return await this.repo.findOneBy({ id });
    return await this.repo.findOne({
      where: { id },
      relations: ['comments'],
    });
  }

  async update(id: number, attrs: Partial<Ticket>): Promise<Ticket> {
    const ticket = await this.repo.findOneBy({ id });
    if (!ticket) {
      throw new Error('ticket not found');
    }
    Object.assign(ticket, attrs);
    return this.repo.save(ticket);
  }

  async remove(id: number): Promise<Ticket> {
    const ticket = await this.repo.findOneBy({ id });
    if (!ticket) {
      throw new Error('ticket not found');
    }
    return this.repo.remove(ticket);
  }

  async softDelete(id: number): Promise<Ticket> {
    const ticket = await this.repo.findOneBy({ id });
    if (!ticket) {
      throw new Error('ticket not found');
    }
    ticket.deletedAt = new Date();
    return this.repo.save(ticket);
  }
}
