<?php /* @var $this Controller */ ?>
<!DOCTYPE html>
<html lang="en" class="no-js" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        
	<meta name="language" content="en" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
	

        <!-- If you are using CSS version, only link these 2 files, you may add app.css to use for your overrides if you like. -->
        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/foundation.min.css">
        
        <script src="js/vendor/modernizr.js"></script>
        
        <link rel="stylesheet" href="css/languageChat.css">
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>

<div class="" id="page">
	<!--<div class="top-bar" data-topbar>
		<?php /*$this->widget('zii.widgets.CMenu',array(
			'items'=>array(
				array('label'=>'Home', 'url'=>array('/site/index'),'itemOptions'=>array('class'=>'title-area')),
				array('label'=>'About', 'url'=>array('/site/page', 'view'=>'about')),
				array('label'=>'Contact', 'url'=>array('/site/contact')),
				array('label'=>'Login', 'url'=>array('/site/login'), 'visible'=>Yii::app()->user->isGuest),
				array('label'=>'Logout ('.Yii::app()->user->name.')', 'url'=>array('/site/logout'), 'visible'=>!Yii::app()->user->isGuest)
			),
		));*/ ?>
	</div><!-- mainmenu -->
        
        <nav class="top-bar" data-topbar data-options="is_hover: false">
            
            <ul class="title-area">
              <li class="name">
                  <h1><?php echo CHtml::link(CHtml::encode(Yii::app()->name), Yii::app()->createUrl('site/index')) ?></h1>
              </li>
              <li class="toggle-topbar menu-icon"><a href="#">Menu</a></li>
            </ul>

            <section class="top-bar-section">
              <!-- Right Nav Section -->
              <!--<ul class="left">
                <li class="active"><a href="#">Right Button Active</a></li>
                <li class="has-dropdown">
                  <a href="#">Right Button Dropdown</a>
                  <ul class="dropdown">
                    <li><a href="#">First link in dropdown</a></li>
                  </ul>
                </li>
              </ul>-->
              <ul class="left">
                  <li><?php echo CHtml::link('Chat', Yii::app()->createUrl('site/chat')) ?></li>
              </ul>
              
              <ul class="left">
                  <li><?php echo CHtml::link('News', Yii::app()->createUrl('site/login')) ?></li>
              </ul>

              <!-- Left Nav Section -->
              <?php if(Yii::app()->user->isGuest): ?>
                <ul class="right">
                  <li><?php echo CHtml::link('Login', Yii::app()->createUrl('site/login')) ?></li>
                </ul>
              
              <?php else: ?>
                <ul class="right">
                  <li class="has-dropdown">
                    <?php echo CHtml::link(Yii::app()->user->username, '#') ?>
                    <ul class="dropdown">
                      <li><?php echo CHtml::link('logout', Yii::app()->createUrl('site/logout')) ?></li>
                      <li><?php echo CHtml::link('profile', Yii::app()->createUrl('site/logout')) ?></li>
                    </ul>
                  </li>
                </ul>
              <?php endif; ?>
            </section>
        </nav>
        
	<?php if(isset($this->breadcrumbs)):?>
		<?php $this->widget('zii.widgets.CBreadcrumbs', array(
			'links'=>$this->breadcrumbs,
		)); ?><!-- breadcrumbs -->
	<?php endif?>
        
        
        <div data-alert id="js-alert"></div>
                
        <!--<div data-alert class="alert-box warning">
            <?php //echo Yii::app()->user->getFlash('error'); ?>
            <a href="#" class="close">&times;</a>
        </div>-->
                
        <main class="small-11 small-centered columns">
            <?php echo $content; ?>
        </main>

	<div class="clear"></div>

	<footer class="medium-3 medium-centered columns small-12">
		Copyright &copy; <?php echo date('Y'); ?> by My Company.<br/>
		All Rights Reserved.<br/>
		<?php echo Yii::powered(); ?>
	</footer><!-- footer -->

</div><!-- page -->

<?php Yii::app()->clientScript->registerCoreScript('jquery'); ?>
<script src="js/foundation.min.js"></script>
<script src="js/vendor/fastclick.js"></script>
<script src="js/jquery.cookie.js"></script>
<?php
//echo Yii::app()->request->cookies['start'];

if(!Yii::app()->user->isGuest){
    $baseUrl = Yii::app()->baseUrl;

    $cs = Yii::app()->getClientScript();

    $cs->registerScriptFile($baseUrl.'/js/chat.js');
    $cs->registerScriptFile('http://192.168.1.33:3000/socket.io/socket.io.js',CClientScript::POS_END);
}

/*if(!isset($login) AND isset(Yii::app()->request->cookies['start'])){
    unset(Yii::app()->request->cookies['start']);
}*/
?>
<script>
  $(document).foundation();
</script>

</body>
</html>
