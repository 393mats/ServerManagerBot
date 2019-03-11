<?php 

namespace svmPlugin;
use pocketmine\plugin\PluginBase;
use pocketmine\event\Listener;
use pocketmine\event\player\PlayerJoinEvent;

class svmPlugin extends PluginBase implements Listener{
 
    public function onEnable(){
        $this->getLogger()->info('Server Manager is enabled.');
        $this->getServer()->getPluginManager()->registerEvents($this, $this);
    }
 
    public function onJoin(PlayerJoinEvent $e){
        $pl = $e->getPlayer();
        $pl->sendMessage("Hello World");
    }
}