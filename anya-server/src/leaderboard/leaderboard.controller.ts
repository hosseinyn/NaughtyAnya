import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import type SubmitBody from './dto/submit.dto';
import type UserLeaderboardBody from './dto/user.dto';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {

    constructor(private leaderboardService : LeaderboardService) {};

    @Patch("submit")
    async SubmitScore(@Body() body : SubmitBody) {

        return this.leaderboardService.submit_score(body);

    }

    @Get("all")
    async GetAllLeaderboard() {

        return this.leaderboardService.get_leaderboard();

    }

    @Post("user")
    async GetUserLeaderboard(@Body() body : UserLeaderboardBody) {

        return this.leaderboardService.get_user_leaderboard_data(body.username)

    }

}
