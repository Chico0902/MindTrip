package com.a303.consultms.domain.channel.controller;

import com.a303.consultms.domain.channel.Channel;
import com.a303.consultms.domain.channel.service.ChannelService;
import com.a303.consultms.domain.message.Message;
import com.a303.consultms.domain.message.service.MessageService;
import com.a303.consultms.global.client.MemberClient;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class StompChannelController {

    //특정 Broker 에게 메시지를 전달
    private final SimpMessagingTemplate template;
    private final ChannelService channelService;
    private final MessageService messageService;
    private final MemberClient memberClient;

    @MessageMapping(value = "/api/chat/enter")
    public void enter(int receiver, int sender
    ) throws IOException {

        Channel channel = channelService.readPersonalChatByRecevier(receiver, sender);
        template.convertAndSend("/sub/chat/room/" + channel.getChannelId(),  "채팅방에 입장하였습니다.");
    }

    // 개인 메시지 전송
    @MessageMapping(value = "/api/chat/send/{channelId}")
//    @SendTo("/topic/send")
    public void sendMessage(@DestinationVariable String channelId, Message messageReq)
        throws IOException {
        log.debug("[StompChatController - sendMessage]: room id = {}", channelId);

        // 메시지를 저장하고 필요한 작업을 수행합니다.
        Message message = messageService.registerPersonalMessage(channelId, messageReq);

        // 저장된 메시지를 클라이언트에게 전송합니다.
        template.convertAndSend("/sub/" + channelId, message);
    }
}
