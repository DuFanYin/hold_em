import socket
 
buf_size=1024
p = socket.socket(socket.AF_INET,socket.SOCK_STREAM)#创建socket并设置server端连接的IP地址和端口

p.connect(('127.0.0.1',9009))
msg = p.recv(buf_size) #接收server端反馈的信息编号

player_id = msg 
print("connected to server, you are player" + str(player_id))  # 连接成功时将server端ip地址反馈到client端         #定义client端编号为num  


#成功连接时开启主循环
if(msg!='end'):
    while 1:
        msg = p.recv(buf_size)           # 接收server端发送的当前client编号
        if msg == player_id:
            msg_action=input("pls choose action"+'\n')
            p.send(msg_action.encode('utf-8')) 
            print("sent to server") 
else:
    p.close()
    print("connection lost")

