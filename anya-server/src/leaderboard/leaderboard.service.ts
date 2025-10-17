import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'db/data-source';
import { Leaderboard } from 'db/models/Leaderboard';

@Injectable()
export class LeaderboardService {

    async get_leaderboard() {
        const leaderboardRepository = AppDataSource.getRepository(Leaderboard);

        const leaderboardData = await leaderboardRepository.find();

        return {
            leaderboard : leaderboardData
        }

    }

    async get_user_leaderboard_data(username : string) {
        
        const leaderboardRepository = AppDataSource.getRepository(Leaderboard);

        const found_user = await leaderboardRepository.findOneBy({
            username : username
        })

        if (found_user) {

            return {
                score : found_user.score
            }

        } else {

            return {
                error : "User does not exists"
            }

        }

    }


    async submit_score(data : any) {

        const leaderboardRepository = AppDataSource.getRepository(Leaderboard);

        try {

            const found_user = await leaderboardRepository.findOneBy({
                username: data.username
            })

            if (found_user) {

                found_user.score = data.score;

                await leaderboardRepository.save(found_user);

            } else {

                const user_data = await leaderboardRepository.findOneBy({
                    username: data.username
                })

                const create_score = leaderboardRepository.create({
                    username: data.username,
                    score: data.score,
                    age: user_data?.age
                })

                await leaderboardRepository.save(create_score);

            }

            return {
                message : "Score submitted"
            }

        } catch (e) {

            return {
                error : "Error in score submit"
            }

        }

    }

}
