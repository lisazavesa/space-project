import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class SentinelHubAuthService {
    async getAccessToken(): Promise<string> {
        const response = await axios.post(
            "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token",
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.SENTINEL_HUB_CLIENT_ID!,
                client_secret: process.env.SENTINEL_HUB_CLIENT_SECRET!,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );

        return response.data.access_token;
    }
}
